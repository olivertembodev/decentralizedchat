import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from 'lib/authentication';
import '../../styles/form.css';
import { gun, user } from 'lib/gun';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user['is']) {
      navigate('/chat');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;

    setIsLoading(true);
    loginUser({ username, password }, async (res: any) => {
      setIsLoading(false);
      if (res.errCode === 'gun-auth-error') {
        const check = await gun.get(`~@${username}`);
        if (check) {
          alert(res.errMessage);
        } else {
          registerUser({ username, password }, (res: any) => {
            loginUser({ username, password });
            setTimeout(() => {
              navigate('/chat');
            }, 1000);
          });
        }
      } else {
        setTimeout(() => {
          navigate('/chat');
        }, 1000);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-wrapper">
          <label className="label" htmlFor="username">
            Username
          </label>
          <input
            placeholder="Username"
            required
            className="input"
            id="username"
            type="username"
            name="username"
          />
        </div>
        <div className="input-wrapper">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            placeholder="Password"
            required
            className="input"
            id="password"
            type="password"
            name="password"
          />
        </div>
        <div className="button-wrapper">
          <button className="button" type="submit" disabled={isLoading}>
            Next
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
