import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '@/services/supabase'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function CreateAccount() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    function verifyDataToCreateAccount() {
        if (email === '') {
            return toastWarn('Preencha seu email')
        }
        if (email === '' || !isValidEmail(email)) {
            return toastWarn('Preencha um email válido')
        }
        if (password === '') {
            return toastWarn('Preencha sua senha')
        }
        if (password === '' || !isValidPassword(password)) {
            return toastWarn(
                'Sua senha deve ter mais de 7 caracteres, Pelo menos uma letra maiúscula e pelo menos um número'
            )
        }
        if (confirmPassword === '') {
            return toastWarn('Confirme sua senha')
        }
        if (confirmPassword !== password) {
            return toastWarn('Suas senhas precisam ser iguais')
        }
        handleCreateUser()
        toastSuccess('Conta criada com sucesso!')
        handleRedirectToConfirmEmail()
    }

    async function handleCreateUser() {
        try {
            let { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            })
            if (error) {
                return console.log(error)
            }
        } catch (error) {
            return console.log(error)
        }
    }

    function isValidEmail(email: string) {
        const padrao = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return padrao.test(email)
    }

    function isValidPassword(password: string) {
        const padrao = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\s])(.{8,})$/
        return padrao.test(password)
    }

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

    const router = useRouter()
    function handleRedirectToConfirmEmail() {
        router.push('/confirm-email')
    }
    return (
        <>
            <div className="h-screen flex items-center justify-center bg-sky-300 shadow-lg w-screen overflow-hidden">
                <div className="flex flex-col items-center w-64 gap-4">
                    <div className="flex items-center flex-col">
                        <h1 className="text-white font-sans font-bold text-2xl">
                            Louça Cash
                        </h1>
                        <span className="text-zinc-950 font-semibold">
                            Ganhe dinheiro lavando pratos 😅
                        </span>
                    </div>

                    <div className="flex flex-col w-full">
                        <span className="ml-2 text-white text-sm">Email</span>
                        <input
                            placeholder="Digite seu email"
                            className="h-10 rounded-md p-2 shadow-xl outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <span className="ml-2 text-white text-sm shadow-xl">
                            Senha
                        </span>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="h-10 rounded-md p-2 shadow-xl outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col w-full">
                        <span className="ml-2 text-white text-sm">
                            Confirme sua senha
                        </span>
                        <input
                            type="password"
                            placeholder="Confirme sua senha"
                            className="h-10 rounded-md p-2 shadow-xl outline-none"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="w-64 flex flex-col items-center gap-1">
                        <button
                            className="bg-louca-green w-full rounded-md h-10 font-semibold shadow-xl"
                            onClick={verifyDataToCreateAccount}
                        >
                            Criar conta
                        </button>
                        <Link href={'/'}>
                            <span className="text-sm">
                                já tem uma conta? clique aqui
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            
        </>
    )
}
