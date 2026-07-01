-- ============================================================
-- LIBRARY BOOK TRACKER - MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS library_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE library_tracker;

-- ─────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────

-- Staff / admin accounts that can log into the system
-- (distinct from `members`, who are library patrons that borrow books)
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(150)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('admin','librarian') NOT NULL DEFAULT 'librarian',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  last_login_at DATETIME,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Members (library card holders)
CREATE TABLE IF NOT EXISTS members (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(150)        NOT NULL,
  email         VARCHAR(255)        NOT NULL UNIQUE,
  phone         VARCHAR(20),
  address       TEXT,
  membership_no VARCHAR(20)         NOT NULL UNIQUE,
  is_active     TINYINT(1)          NOT NULL DEFAULT 1,
  joined_at     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Authors
CREATE TABLE IF NOT EXISTS authors (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  bio        TEXT,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Books catalogue
CREATE TABLE IF NOT EXISTS books (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  isbn            VARCHAR(20)   NOT NULL UNIQUE,
  title           VARCHAR(300)  NOT NULL,
  author_id       INT UNSIGNED  NOT NULL,
  genre           VARCHAR(80),
  publisher       VARCHAR(150),
  published_year  YEAR,
  total_copies    INT UNSIGNED  NOT NULL DEFAULT 1,
  available_copies INT UNSIGNED NOT NULL DEFAULT 1,
  cover_url       VARCHAR(500),
  description     TEXT,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_books_author
    FOREIGN KEY (author_id) REFERENCES authors (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Loans (checkouts)
CREATE TABLE IF NOT EXISTS loans (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  book_id         INT UNSIGNED  NOT NULL,
  member_id       INT UNSIGNED  NOT NULL,
  checked_out_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date        DATE          NOT NULL,
  returned_at     DATETIME,
  status          ENUM('active','returned','overdue') NOT NULL DEFAULT 'active',
  notes           TEXT,
  CONSTRAINT fk_loans_book
    FOREIGN KEY (book_id)   REFERENCES books   (id) ON DELETE RESTRICT,
  CONSTRAINT fk_loans_member
    FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE RESTRICT,
  INDEX idx_loans_status   (status),
  INDEX idx_loans_due_date (due_date),
  INDEX idx_loans_member   (member_id),
  INDEX idx_loans_book     (book_id)
) ENGINE=InnoDB;

-- Fine / penalty records
CREATE TABLE IF NOT EXISTS fines (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  loan_id     INT UNSIGNED     NOT NULL UNIQUE,
  amount      DECIMAL(8,2)     NOT NULL DEFAULT 0.00,
  reason      VARCHAR(200),
  paid        TINYINT(1)       NOT NULL DEFAULT 0,
  paid_at     DATETIME,
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fines_loan
    FOREIGN KEY (loan_id) REFERENCES loans (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- VIEWS (handy read models)
-- ─────────────────────────────────────────────

CREATE OR REPLACE VIEW v_active_loans AS
  SELECT
    l.id            AS loan_id,
    b.title         AS book_title,
    b.isbn,
    m.full_name     AS member_name,
    m.membership_no,
    l.checked_out_at,
    l.due_date,
    DATEDIFF(CURDATE(), l.due_date) AS days_overdue,
    l.status
  FROM loans l
  JOIN books   b ON b.id = l.book_id
  JOIN members m ON m.id = l.member_id
  WHERE l.status != 'returned';

CREATE OR REPLACE VIEW v_overdue_loans AS
  SELECT * FROM v_active_loans
  WHERE days_overdue > 0;

-- ─────────────────────────────────────────────
-- TRIGGERS
-- ─────────────────────────────────────────────

DELIMITER $$

-- Decrease available copies on checkout
CREATE TRIGGER trg_loan_checkout
AFTER INSERT ON loans
FOR EACH ROW
BEGIN
  UPDATE books
  SET    available_copies = available_copies - 1
  WHERE  id = NEW.book_id;
END$$

-- Restore available copies on return; auto-create fine if overdue
CREATE TRIGGER trg_loan_return
AFTER UPDATE ON loans
FOR EACH ROW
BEGIN
  IF NEW.returned_at IS NOT NULL AND OLD.returned_at IS NULL THEN
    UPDATE books
    SET    available_copies = available_copies + 1
    WHERE  id = NEW.book_id;

    -- create fine when overdue (₹5 per day)
    IF NEW.returned_at > NEW.due_date THEN
      INSERT INTO fines (loan_id, amount, reason)
      VALUES (
        NEW.id,
        GREATEST(0, DATEDIFF(NEW.returned_at, NEW.due_date)) * 5.00,
        'Late return'
      );
    END IF;
  END IF;
END$$

DELIMITER ;

-- ─────────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────────

-- Default admin login: email=admin@library.com  password=Admin@123
-- ⚠ Change this password immediately after first login in a real deployment.
INSERT INTO users (full_name, email, password_hash, role) VALUES
  ('Admin User', 'admin@library.com',
   '$2a$10$jLTM/NDxiq3LjXAJEiGDiubT.LgOezKYG7oMca3MDsL7Y.OYo.ZbW', 'admin');

INSERT INTO authors (name, bio) VALUES
  ('George Orwell',      'English novelist and essayist.'),
  ('J.K. Rowling',       'British author of the Harry Potter series.'),
  ('Yuval Noah Harari',  'Israeli historian and author of Sapiens.'),
  ('Ruskin Bond',        'Indian author of stories and novels.'),
  ('Arundhati Roy',      'Indian author and political activist.');

INSERT INTO books (isbn, title, author_id, genre, publisher, published_year, total_copies, available_copies) VALUES
  ('9780451524935', '1984',                          1, 'Dystopian Fiction', 'Signet Classic',   1949, 3, 3),
  ('9780439708180', 'Harry Potter and the Sorcerer''s Stone', 2, 'Fantasy', 'Scholastic',  1997, 4, 4),
  ('9780062316097', 'Sapiens',                        3, 'Non-Fiction',      'Harper Perennial', 2011, 2, 2),
  ('9788172231231', 'The Room on the Roof',           4, 'Fiction',          'Penguin Books',    1956, 2, 2),
  ('9780006550686', 'The God of Small Things',        5, 'Literary Fiction', 'Flamingo',         1997, 3, 3);

INSERT INTO members (full_name, email, phone, membership_no) VALUES
  ('Priya Sharma',  'priya@example.com',  '9876543210', 'LIB-001'),
  ('Arjun Mehta',   'arjun@example.com',  '9123456789', 'LIB-002'),
  ('Sneha Patel',   'sneha@example.com',  '9000012345', 'LIB-003');
