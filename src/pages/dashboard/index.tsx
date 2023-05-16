import { MdWaterDrop } from "react-icons/md"
import { useState, useEffect } from "react"
import { supabase } from "@/services/supabase"
import { useRouter } from "next/router"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Dashboard() {
    const [loucaCash, setLoucaCash] = useState<number>(0)
    const [loucaList, setLoucaList] = useState<LcData[]>([])
    const [navIsOpen, setNavIsOpen] = useState<boolean>(false)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [listIsNull, setListIsNull] = useState<boolean>(true)
    const [userId, setUserId] = useState("")

    function openCloseNav() {
        setNavIsOpen(!navIsOpen)
    }

    function openModal() {
        setModalIsOpen(!modalIsOpen)
    }

    async function handleAddCash() {
        try {
            const { data, error } = await supabase
                .from("lc_data")
                .insert([{ lou_num: `${loucaCash + 1}`, user_id: userId }])
            if (error) {
                return console.log(error)
            }
            handleReload()
            setLoucaCash(loucaCash + 1)
        } catch (err) {
            console.log(err)
        }
    }

    async function getSupaData() {
        try {
            let { data, error } = await supabase.from("lc_data").select("*")

            if (error) {
                return console.log(error)
            }

            const lcData = data as LcData[]

            const lcFormatedDate = lcData.map((item) => {
                const oldDate = new Date(item.created_at)
                const dia = oldDate.getDate().toString().padStart(2, "0")
                const mes = (oldDate.getMonth() + 1).toString().padStart(2, "0")
                const ano = oldDate.getFullYear()
                const hora = oldDate.getHours().toString().padStart(2, "0")
                const minuto = oldDate.getMinutes().toString().padStart(2, "0")
                return {
                    ...item,
                    dataFormatada: `louça lavada na data ${dia}/${mes}/${ano} as ${hora}:${minuto}`,
                }
            })

            console.log(lcData)

            setLoucaCash(lcData.length)
            if (lcData.length > 0) {
                setListIsNull(false)
            }

            setLoucaList(lcFormatedDate)
        } catch (err) {
            return console.log(err)
        }
    }

    const router = useRouter()
    function handleRedirectToHome() {
        router.push("/")
    }

    function handleReload() {
        router.reload()
    }

    useEffect(() => {
        const userId: any = localStorage?.getItem("userId")
        getSupaData()
        localStorage?.getItem("userAccessToken")
            ? console.log("Acesso permitido")
            : handleRedirectToHome(),
            setUserId(userId)
    }, [])

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

            {listIsNull ? (
                <div className="flex justify-center flex-col w-screen items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <h1 className="font-semibold">
                        Ainda não temos louças lavadas 😭
                    </h1>
                    <Image
                        alt="Lista vazia"
                        src={"/box-null.svg"}
                        width={200}
                        height={200}
                        className="pb-4"
                    />
                    <button
                        className="bg-louca-green w-4/5 rounded-md h-10 font-semibold shadow-xl hover:scale-105 transition-all"
                        onClick={handleAddCash}
                    >
                        Adicionar primeira louça
                    </button>
                </div>
            ) : (
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
            )}
            <motion.div
                drag="y"
                dragConstraints={{ bottom: 0, top: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={openModal}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="absolute bottom-0 right-0 rounded-full bg-purple-600 shadow-lg shadow-purple-400 mr-4 mb-4 w-20 h-20 items-center flex justify-center"
            >
                <button className="w-full h-full">
                    <h1 className="text-white text-5xl font-serif">+</h1>
                </button>
            </motion.div>

            {modalIsOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
                    <div className=" w-screen flex items-center justify-center h-full">
                        <div className="bg-purple-600 w-96 h-52 flex flex-col justify-center rounded-xl p-4 gap-6 items-center">
                            <h1 className="text-white text-xl">
                                Adicionar nova louça
                            </h1>
                            <div className="flex items-center justify-center gap-4 w-full">
                                <button
                                    className="bg-louca-green w-full rounded-md h-10 font-semibold shadow-xl hover:scale-105 ease-in-out transition-all"
                                    onClick={handleAddCash}
                                >
                                    Adicionar
                                </button>
                                <button
                                    className="bg-[#e32636] w-full rounded-md h-10 font-semibold shadow-xl hover:scale-105 ease-in-out transition-all"
                                    onClick={openModal}
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
    )
}
