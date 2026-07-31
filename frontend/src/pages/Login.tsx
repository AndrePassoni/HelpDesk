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
      <div className="w-full md:w-1/2 flex flex-col items-center bg-gray-600 p-4 pt-16 overflow-y-auto md:rounded-tl-[64px] custom-scrollbar">
        
        <div className="w-full max-w-[420px] flex flex-col items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <img src={LogoIcon} alt="HelpDesk Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold text-brand-dark">HelpDesk</span>
          </div>

          {/* Login Card */}
          <div className="w-full bg-white border border-gray-500 rounded-xl p-8 mb-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-100">Acesse o portal</h1>
            <p className="text-sm text-gray-400 mt-1 mb-6">Entre usando seu e-mail e senha cadastrados</p>

            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col">
              
              <div className="mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">E-mail</label>
                <input 
                  type="email"
                  placeholder="exemplo@mail.com"
                  {...register("email")}
                  className={`w-full border-b py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-brand-base transition-colors bg-transparent ${errors.email ? 'border-feedback-danger' : 'border-gray-500'}`}
                />
                {errors.email && <span className="text-feedback-danger text-xs mt-1 block font-bold">{errors.email.message}</span>}
              </div>

              <div className="mb-6">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Senha</label>
                <input 
                  type="password"
                  placeholder="Digite sua senha"
                  {...register("password")}
                  className={`w-full border-b py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-brand-base transition-colors bg-transparent ${errors.password ? 'border-feedback-danger' : 'border-gray-500'}`}
                />
                {errors.password && <span className="text-feedback-danger text-xs mt-1 block font-bold">{errors.password.message}</span>}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-100 hover:bg-gray-200 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>

          {/* Register Card */}
          <div className="w-full bg-white border border-gray-500 rounded-xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-100">Ainda não tem uma conta?</h2>
            <p className="text-sm text-gray-400 mt-1 mb-6">Cadastre agora mesmo</p>
            
            <button className="w-full bg-gray-500 hover:bg-gray-400 text-gray-100 font-bold py-3 rounded-md transition-colors">
              Criar conta
            </button>
          </div>

        </div>
      </div>
      
    </div>
  );
}
