import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { supabase } from '@/services/supabase'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    function verifyDataToLogin() {
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
                'Sua senha tem mais de 7 caracteres, Pelo menos uma letra maiúscula e pelo menos um número'
            )
        }
        return handleLogin()
    }

    async function handleLogin() {
        try {
            let { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })

            if (error) {
                return console.log(error)
            }
            if (!error && data.session && data.user) {
                localStorage.setItem(
                    'userAccessToken',
                    data.session.access_token
                )
                localStorage.setItem('userId', data.user.id)

                handleRedirectToDashboard()
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

    const router = useRouter()
    function handleRedirectToDashboard() {
        router.push('/dashboard')
    }

    useEffect(() => {
        localStorage.removeItem('userAccessToken')
    }, [])

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
                        <span className="ml-2 text-white text-sm">Senha</span>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="h-10 rounded-md p-2 shadow-xl outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="w-64 flex flex-col items-center gap-1">
                        <button
                            className="bg-louca-green w-full rounded-md h-10 font-semibold shadow-xl hover:scale-105 transition-all"
                            onClick={verifyDataToLogin}
                        >
                            Entrar
                        </button>
                        <Link href={'/criar-conta'}>
                            <span className="text-sm">
                                Ainda não tem uma conta? clique aqui
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}
