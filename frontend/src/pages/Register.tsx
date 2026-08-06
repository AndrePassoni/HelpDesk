import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import LogoIcon from "../assets/Logo_IconDark.svg";
import BackgroundImage from "../assets/Login_Background.svg";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 dígitos"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  async function handleRegister(data: RegisterForm) {
    try {
      await api.post("/users", data);
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao cadastrar. Tente novamente.";
      alert(message);
    }
  }

  return (
    <div
      className="h-screen overflow-hidden flex w-full bg-brand-dark bg-cover bg-center bg-no-repeat justify-end pt-8 md:pt-12"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="w-full md:w-1/2 flex flex-col items-center bg-gray-600 p-4 pt-16 overflow-y-auto md:rounded-tl-[20px] custom-scrollbar">
        <div className="w-full max-w-100 flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <img src={LogoIcon} alt="HelpDesk Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-brand-dark">HelpDesk</span>
          </div>

          {/* Create Account */}
          <div className="w-full border border-gray-500 rounded-[10px]">
            {/* SignUp Card */}
            <div className="px-7 py-7">
              <h1 className="text-xl font-bold text-gray-200 leading-[1.4]">
                Crie sua conta
              </h1>
              <p className="text-xs font-normal text-gray-300 leading-[1.4] mt-0.5 mb-10">
                Informe seu nome, e-mail e senha
              </p>

              <form
                onSubmit={handleSubmit(handleRegister)}
                className="flex flex-col gap-4"
              >
                {/* Nome */}
                <div className="flex flex-col justify-center">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-0.5">
                    Nome
                  </label>
                  <div
                    className={`h-10 border-b flex items-center px-2 ${
                      errors.name ? "border-feedback-danger" : "border-black"
                    }`}
                  >
                    <input
                      type="text"
                      placeholder="Digite o nome completo"
                      {...register("name")}
                      className="w-full bg-transparent text-base font-normal text-gray-200 placeholder:text-gray-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="flex flex-col justify-center">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-0.5">
                    E-mail
                  </label>
                  <div
                    className={`h-10 border-b px-2 flex items-center ${
                      errors.email ? "border-feedback-danger" : "border-[#000000]"
                    }`}
                  >
                    <input
                      type="email"
                      placeholder="exemplo@mail.com"
                      {...register("email")}
                      className="w-full bg-transparent text-base font-normal text-gray-200 placeholder:text-gray-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="flex flex-col justify-center">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-[0.6px] leading-[1.4] mb-0.5">
                    Senha
                  </label>
                  <div
                    className={`h-10 border-b px-2 flex items-center gap-2 ${
                      errors.password ? "border-feedback-danger" : "border-[#000000]"
                    }`}
                  >
                    <input
                      type="password"
                      placeholder="Digite sua senha"
                      {...register("password")}
                      className="w-full bg-transparent text-base font-normal text-gray-200 placeholder:text-gray-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1 pt-1.5">
                    <span className={`text-xs font-bold leading-[1.4] ${errors.password ? "text-feedback-danger" : "text-gray-400"}`}>
                      Mínimo de 6 dígitos
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-[5px] bg-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                </button>
              </form>
            </div>

            {/* Access Account Card */}
            <div className="border-t border-gray-500 p-7">
              <h2 className="text-base font-normal text-gray-200 leading-[1.4]">
                Já uma conta?
              </h2>
              <p className="text-xs font-normal text-gray-300 leading-[1.4] mt-0.5 mb-6">
                Entre agora mesmo
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full h-10 rounded-[5px] bg-gray-500 text-gray-200 font-bold text-sm hover:bg-gray-400 transition-colors flex items-center justify-center"
              >
                Acessar conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}