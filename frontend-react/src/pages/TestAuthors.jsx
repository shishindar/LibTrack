import { useEffect } from "react";
import { authorsApi } from "../api/authors";

export default function TestAuthors() {

    useEffect(() => {

        async function load(){

            const res = await authorsApi.getAll();

            console.log(res);

        }

        load();

    }, []);

    return <h1>Testing Authors API...</h1>;

}