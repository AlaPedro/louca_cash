import { MdWaterDrop } from 'react-icons/md'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/services/supabase'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { toast, ToastContainer } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FaTrash } from 'react-icons/fa'

export default function Dashboard() {
    const [loucaCash, setLoucaCash] = useState<number>(0)
    const [loucaList, setLoucaList] = useState<LcData[]>([])
    const [navIsOpen, setNavIsOpen] = useState<boolean>(false)
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [listIsNull, setListIsNull] = useState<boolean>(true)
    const [userId, setUserId] = useState('')
    const [loucaValue, setLoucaValue] = useState<number>(0)
    const [media, setMedia] = useState('')

    function openCloseNav() {
        setNavIsOpen(!navIsOpen)
    }

    const handleUpload = async (e: any) => {
        let file

        if (e.target.files) {
            file = e.target.files[0]
        }

        const { data, error } = await supabase.storage
            .from('louca-images')
            .upload('public/' + file.name, file)

        if (data) {
            setMedia(data.path)
            console.log(data)
        }
        if (error) {
            console.log(error)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const { data, error } = await supabase
                .from('lc_data')
                .delete()
                .match({ id: id })

            if (error) {
                console.error('Erro ao deletar louça:', error.message)
                return
            }

            handleReload()
            toastSuccess('Louça deletada com sucesso')
        } catch (err) {
            console.error('Erro ao deletar louça:', err)
        }
    }

    const openModal = () => {
        setModalIsOpen(!modalIsOpen)
    }

    async function handleAddCash() {
        if (loucaValue === 0) {
            return alert('O valor da louça não pode ser 0')
        }
        if (media === '') {
            return alert('Você precisa adicionar uma imagem da louça')
        }
        try {
            const { data, error } = await supabase.from('lc_data').insert([
                {
                    lou_num: `${loucaCash + 1}`,
                    user_id: userId,
                    value: loucaValue,
                    image_url: media,
                },
            ])

            if (error) {
                console.error('Erro ao inserir dados:', error.message)
                return
            }

            handleReload()
            setLoucaCash(loucaCash + 1)
        } catch (err) {
            console.error('Erro ao adicionar louça:', err)
        }
    }

    async function getSupaData() {
        try {
            let { data, error } = await supabase.from('lc_data').select('*')

            if (error) {
                return console.log(error)
            }

            const lcData = data as LcData[]

            const lcFormatedDate = lcData.map((item) => {
                const oldDate = new Date(item.created_at)
                const dia = oldDate.getDate().toString().padStart(2, '0')
                const mes = (oldDate.getMonth() + 1).toString().padStart(2, '0')
                const ano = oldDate.getFullYear()
                const hora = oldDate.getHours().toString().padStart(2, '0')
                const minuto = oldDate.getMinutes().toString().padStart(2, '0')
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
        router.push('/')
    }

    function handleReload() {
        router.reload()
    }

    useEffect(() => {
        const userId: any = localStorage?.getItem('userId')
        getSupaData()
        localStorage?.getItem('userAccessToken')
            ? console.log('Acesso permitido')
            : handleRedirectToHome(),
            setUserId(userId)
    }, [])

    const toastWarn = (message: string) => {
        toast.warn(message, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        })
    }

    const toastSuccess = (message: string) => {
        toast.success(message, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
        })
    }

    return (
        <>
            <AnimatePresence>
                <button onClick={openCloseNav}>
                    <motion.header
                        className="h-20 flex items-center bg-sky-300 shadow-lg rounded-br-xl rounded-bl-xl fixed top-0 left-0 right-0"
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
                        src={'/box-null.svg'}
                        width={200}
                        height={200}
                        className="pb-4"
                    />
                    <button
                        className="bg-louca-green w-4/5 rounded-md h-10 font-semibold shadow-xl hover:scale-105 transition-all"
                        onClick={openModal}
                    >
                        Adicionar primeira louça
                    </button>
                </div>
            ) : (
                <div className="text-white flex flex-col gap-2 w-4/5 m-auto mb-10">
                    {loucaList.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-6 justify-center bg-[#353535] h-auto items-center rounded-md p-4"
                        >
                            <img
                                className="rounded-lg drop-shadow-sm shadow-lg w-20"
                                src={`https://pyubkabddwrtmwzseorm.supabase.co/storage/v1/object/public/louca-images/${item.image_url}`}
                            />
                            <span className="text-xs xsm:text-base font-semibold">
                                {item.lou_num} - {item.value} R$
                            </span>
                            <span className="text-xs xsm:text-base font-semibold">
                                {item.dataFormatada}
                            </span>
                            <button
                                onClick={() => {
                                    handleDelete(item.id)
                                }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <motion.div
                drag="y"
                dragConstraints={{ bottom: 0, top: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={openModal}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="absolute bottom-0 right-0 rounded-full bg-sky-600 shadow-lg shadow-sky-400 mr-4 mb-4 w-20 h-20 items-center flex justify-center"
            >
                <button className="w-full h-full">
                    <h1 className="text-white text-5xl font-serif">+</h1>
                </button>
            </motion.div>

            {modalIsOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
                    <div className=" w-screen flex items-center justify-center h-full">
                        <div className="bg-sky-600 w-fit h-fit flex flex-col justify-center rounded-xl p-8 gap-6 items-center">
                            <h1 className="text-white text-xl">
                                Adicionar nova louça
                            </h1>
                            <div className="flex flex-col w-full gap-2">
                                <Label
                                    className="text-md font-medium text-white"
                                    htmlFor="picture"
                                >
                                    Imagem da louça lavada
                                </Label>
                                <Input
                                    id="picture"
                                    type="file"
                                    accept="image/"
                                    onChange={(e) => {
                                        handleUpload(e)
                                    }}
                                />
                            </div>
                            {media && (
                                <img
                                    className=" max-w-[300px] rounded-lg drop-shadow-sm shadow-lg"
                                    src={`https://pyubkabddwrtmwzseorm.supabase.co/storage/v1/object/public/louca-images/${media}`}
                                />
                            )}
                            <div className="flex flex-col w-full gap-2">
                                <Label
                                    className="text-md font-medium text-white"
                                    htmlFor="value"
                                >
                                    Valor da louça
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="Valor da louça"
                                    value={loucaValue}
                                    onChange={(e) =>
                                        setLoucaValue(Number(e.target.value))
                                    }
                                    className="bg-white rounded-md px-4 py-2 appearance-none"
                                />
                            </div>
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
                        key={'modal'}
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 50,
                        }}
                        className="fixed inset-0 z-50 overflow-y-auto bg-sky-600"
                    >
                        <div className="flex flex-col h-screen justify-center gap-10 text-white">
                            <button
                                className="text-xl transition-colors hover:bg-sky-900 h-20"
                                onClick={handleAddCash}
                            >
                                Adicionar nova louça
                            </button>
                            <button
                                className="text-xl transition-colors hover:bg-sky-900 h-20"
                                onClick={handleRedirectToHome}
                            >
                                Sair do Louça Cash
                            </button>
                            <button
                                className="text-xl transition-colors hover:bg-sky-900 h-20"
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
