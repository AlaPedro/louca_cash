import { MdWaterDrop } from "react-icons/md";
import { BsPlus } from "react-icons/bs";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase";
import { useRouter } from "next/router";

export default function Dashboard() {
    const [loucaCash, setLoucaCash] = useState<number>(0);

    function addCash() {
        setLoucaCash(loucaCash + 1);
        localStorage.setItem("loucaCash", JSON.stringify(loucaCash + 1));
        handleAddCash();
    }

    function resetCash() {
        setLoucaCash(0);
        localStorage.removeItem("loucaCash");
    }

    async function handleAddCash() {
        try {
            const { data, error } = await supabase
                .from("lc_data")
                .insert({ lou_num: `${loucaCash + 1}` });

            if (error) {
                return console.log("error supabase adding items", error);
            }

            alert("foi");
        } catch (err) {
            console.log(err);
        }
    }

    const router = useRouter();
    function handleRedirectToHome() {
        router.push("/");
    }

    useEffect(() => {
        setLoucaCash(Number(localStorage.getItem("loucaCash")));
        localStorage?.getItem("userAccessToken")
            ? console.log("Acesso permitido")
            : handleRedirectToHome();
    }, []);

    return (
        <>
            <header className="h-20 flex items-center bg-purple-600 shadow-lg rounded-br-xl rounded-bl-xl fixed w-full overflow-hidden">
                <div className="flex max-w-[1000px] w-full justify-between m-auto px-10 items-center">
                    <h1 className="text-white font-sans font-bold text-2xl">
                        Louça Cash
                    </h1>

                    <div className="flex items-center gap-1">
                        <span className="text-white text-lg font-bold">
                            {loucaCash}
                        </span>
                        <MdWaterDrop
                            color="#20b2aa"
                            size={18}
                            onClick={resetCash}
                        />
                    </div>
                </div>
            </header>

            <main className="bg-[#111111] h-screen pt-20">
                <h1 className="text-white text-center text-lg font-semibold mt-4">
                    Histórico de louças lavadas
                </h1>
            </main>

            <footer className="h-20 flex items-center bg-purple-600 shadow-lg fixed w-full overflow-hidden bottom-0">
                <div className="w-16 h-16 bg-[#111111] rounded-full text-white items-center flex justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <button onClick={addCash}>
                        <BsPlus size={40} />
                    </button>
                </div>
            </footer>
        </>
    );
}
