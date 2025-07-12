function Login({ onLogin }) {  // Receive onLogin prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
      // Call onLogin with user data
      onLogin({
        email: storedUser.email,
        name: storedUser.name
      });
      
      alert('Login successful!');
      navigate('/');  // Navigate to home page
    } else {
      alert('Invalid email or password.');
    }
  };

  // ... rest of the component
}