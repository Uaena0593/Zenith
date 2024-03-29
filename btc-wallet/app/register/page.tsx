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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className = 'min-h-screen bg-custom-gray flex flex-col items-center'>
            <div className = "flex flex-col items-start mb-4">
                <div className = 'text-black text-lg mt-16 mb-8'>chen</div>
                <div className = 'bg-white border rounded-md p-12 w-96 h-96 box-shadow'>
                    <div className = 'text-black text-xl mb-4'>Sign in to your account</div>
                    <div>Username</div>
                    <form onSubmit={ register } className = 'flex flex-col items-center'>
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
                        <button type = "submit">Register</button>
                    </form>
                </div>
            </div>
        </section>
  );
}
export default CreateAccount
