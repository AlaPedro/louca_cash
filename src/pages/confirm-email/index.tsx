import Link from "next/link";

export default function CreateAccount() {
    return (
        <>
            <div className="h-screen flex items-center justify-center bg-purple-600 shadow-lg w-screen overflow-hidden">
                <div className="flex flex-col items-center text-white gap-4">
                    <h1>Conta criada com sucesso.</h1>
                    <h1>Confirme seu email para acessar sua conta!</h1>

                    <div>
                        <Link href={"/"}>
                            <button className="bg-louca-green w-72 h-12 rounded-md text-black font-semibold">
                                Ir para página inicial
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
