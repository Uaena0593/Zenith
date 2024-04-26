'use client';
import { useRouter} from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const response = await axios.get("http://localhost:8000/authenticateToken", {withCredentials: true});
      if (response.data == "authenticated") {
        router.push('/landingpage')
      }
    };
    checkAuth();
  }, []);
  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username,
        password,
      }, { withCredentials: true });
      console.log(response.data);
      if (response.status === 201) {
        router.push('/landingpage')
      };
    } catch (error ) {
      if (error.response.status === 409) {
        alert('Username taken');
      }
      console.log(error);
    }
  };

  return (
    <section className = 'min-h-screen ow-background flex flex-col items-center'>
        <div className = 'gradient-bg-2'>
            <div className="g1"></div>
            <div className="g2"></div>
            <div className="g3"></div>
            <div className="g4"></div>
            <div className="g5"></div>
        </div>
        <div className = "flex flex-col items-start mb-4">
            <div className = 'text-black text-lg mt-16 mb-8'>chen</div>
            <div className = 'bg-white border rounded-md p-12 sign-in-box box-shadow'>
                <div className = 'text-black text-xl mb-8 font-bold'>Enter your credentials</div>
                <div>Username</div>
                <form onSubmit={ register } className = 'flex flex-col'>
                    <input
                    className = "border mb-2 p-1 w-72 border-black rounded-sm border-opacity-20"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    />
                    <div>Password</div>
                    <input
                    className = "border mb-2 p-1 w-72 border-black rounded-sm border-opacity-20"
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    />
                    <div className = 'flex flex-col items-center'>
                        <button type = "submit" className = 'inline-border mt-2 px-8 py-2 bg-black bg-opacity-80 text-white rounded-2xl hover:bg-opacity-60 hover:text-white transition duration-300'>Register</button>
                    </div>
                </form>
            </div>
        </div>
    </section>
  );
}
export default CreateAccount
