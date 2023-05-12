import { MdWaterDrop } from "react-icons/md";
import { BsPlus } from "react-icons/bs";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { info } from "console";
import { type } from "os";

export default function Dashboard() {
    const [loucaCash, setLoucaCash] = useState<number>(0);
    const [loucaList, setLoucaList] = useState<LcData[]>([]);
    const [navIsOpen, setNavIsOpen] = useState<boolean>(false);

    function openCloseNav() {
        setNavIsOpen(!navIsOpen);
    }

    async function handleAddCash() {
        try {
            const { data, error } = await supabase
                .from("lc_data")
                .insert([{ lou_num: `${loucaCash + 1}` }]);
            if (error) {
                return console.log(error);
            }
            handleReload();
            setLoucaCash(loucaCash + 1);
        } catch (err) {
            console.log(err);
        }
    }

    async function getSupaData() {
        try {
            let { data, error } = await supabase.from("lc_data").select("*");

            if (error) {
                return console.log(error);
            }

            const lcData = data as LcData[];

            const lcFormatedDate = lcData.map((item) => {
                const oldDate = new Date(item.created_at);
                const dia = oldDate.getDate().toString().padStart(2, "0");
                const mes = (oldDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                const ano = oldDate.getFullYear();
                const hora = oldDate.getHours().toString().padStart(2, "0");
                const minuto = oldDate.getMinutes().toString().padStart(2, "0");
                return {
                    ...item,
                    dataFormatada: `louça lavada na data ${dia}/${mes}/${ano} as ${hora}:${minuto}`,
                };
            });

            setLoucaCash(lcData.length);
            setLoucaList(lcFormatedDate);
        } catch (err) {
            return console.log(err);
        }
    }

    const router = useRouter();
    function handleRedirectToHome() {
        router.push("/");
    }

    function handleReload() {
        router.reload();
    }

    useEffect(() => {
        getSupaData();

        localStorage?.getItem("userAccessToken")
            ? console.log("Acesso permitido")
            : handleRedirectToHome();
    }, []);

    return (
        <>
            <AnimatePresence>
                <button onClick={openCloseNav}>
                    <motion.header
                        className="h-20 flex items-center bg-purple-600 shadow-lg rounded-br-xl rounded-bl-xl fixed top-0 left-0 right-0"
                        initial={{ opacity: 1, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ stiffness: 50 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex max-w-[1000px] w-full justify-between m-auto px-10 items-center">
                            <h1 className="text-white font-sans font-bold text-2xl">
                                Louça Cash
                            </h1>

                            <div className="flex items-center gap-1">
                                <span className="text-white text-lg font-bold">
                                    {loucaCash}
                                </span>
                                <MdWaterDrop color="#20b2aa" size={18} />
                            </div>
                        </div>
                    </motion.header>
                </button>
            </AnimatePresence>

            <div className="pt-16"></div>

            <main className="bg-white h-screen">
                <div className="flex flex-col justify-center">
                    <h1 className="text-black text-center text-lg font-semibold mt-4">
                        Histórico de louças lavadas
                    </h1>
                    {
                        <div className="text-white flex flex-col gap-2 w-4/5 m-auto mb-10">
                            {loucaList.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-6 justify-center bg-[#353535] h-10 items-center rounded-md"
                                >
                                    <span className="text-xs xsm:text-base font-semibold">
                                        {item.lou_num}
                                    </span>
                                    <span className="text-xs xsm:text-base font-semibold">
                                        {item.dataFormatada}
                                    </span>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </main>

            {navIsOpen && (
                <AnimatePresence>
                    <motion.div
                        key={"modal"}
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 50,
                        }}
                        className="fixed inset-0 z-50 overflow-y-auto bg-purple-600"
                    >
                        <div className="flex flex-col h-screen justify-center gap-10 text-white">
                            <button
                                className="text-xl hover:bg-[#b574f1] h-20"
                                onClick={handleAddCash}
                            >
                                Adicionar nova louça
                            </button>
                            <button
                                className="text-xl hover:bg-[#b574f1] h-20"
                                onClick={handleRedirectToHome}
                            >
                                Sair do Louça Cash
                            </button>
                            <button
                                className="text-xl hover:bg-[#b574f1] h-20"
                                onClick={openCloseNav}
                            >
                                Voltar
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </>
    );
}
