import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../assets/Logo_IconDark.svg";
import BackgroundImage from "../assets/Login_Background.svg";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  async function handleLogin(data: LoginForm) {
    try {
      await signIn(data);
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Credenciais inválidas. Tente novamente.";
      alert(message);
    }
  }

  return (
    <div 
      className="h-screen overflow-hidden flex w-full bg-brand-dark bg-cover bg-center bg-no-repeat justify-end pt-8 md:pt-12"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      
      {/* Right Side - Form Container */}
      <div className="w-full md:w-1/2 flex flex-col items-center bg-gray-600 p-4 pt-10 md:pt-16 overflow-y-auto rounded-t-[20px] md:rounded-tr-none md:rounded-tl-[64px] custom-scrollbar">
        
        <div className="w-full max-w-100 flex flex-col items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 md:mb-12">
            <img src={LogoIcon} alt="HelpDesk Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-brand-dark">HelpDesk</span>
          </div>

          <div className="w-full border border-gray-500 rounded-[10px] mb-8">
            {/* Login Card */}
            <div className="px-7 py-7">
              <h1 className="text-xl font-bold text-gray-100 leading-[1.4]">Acesse o portal</h1>
              <p className="text-xs font-normal text-gray-300 leading-[1.4] mt-0.5 mb-10">Entre usando seu e-mail e senha cadastrados</p>

              <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
                
                <div className="flex flex-col justify-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">E-mail</label>
                  <div className={`h-10 border-b flex items-center pb-2 ${errors.email ? 'border-feedback-danger' : 'border-gray-500'}`}>
                    <input 
                      type="email"
                      placeholder="exemplo@mail.com"
                      {...register("email")}
                      className="w-full bg-transparent text-sm md:text-base font-normal text-gray-100 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                  {errors.email && <span className="text-feedback-danger text-[10px] italic mt-1">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col justify-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Senha</label>
                  <div className={`h-10 border-b flex items-center pb-2 ${errors.password ? 'border-feedback-danger' : 'border-gray-500'}`}>
                    <input 
                      type="password"
                      placeholder="Digite sua senha"
                      {...register("password")}
                      className="w-full bg-transparent text-sm md:text-base font-normal text-gray-100 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                  {errors.password && <span className="text-feedback-danger text-[10px] italic mt-1">{errors.password.message}</span>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-[5px] bg-gray-100 hover:bg-gray-200 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </button>
              </form>
            </div>
          </div>

          {/* Register Card */}
          <div className="w-full border border-gray-500 rounded-[10px]">
            <div className="p-7">
              <h2 className="text-base font-bold text-gray-100 leading-[1.4]">Ainda não tem uma conta?</h2>
              <p className="text-xs font-normal text-gray-300 leading-[1.4] mt-0.5 mb-6">Cadastre agora mesmo</p>
              
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full h-10 rounded-[5px] bg-gray-500 hover:bg-gray-400 text-gray-100 font-bold text-sm transition-colors flex items-center justify-center"
              >
                Criar conta
              </button>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
