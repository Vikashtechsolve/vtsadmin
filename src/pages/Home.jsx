import Dashboard from "../components/home/Dashboard";

const Home = () => {    
    return (
        <div>
            <Dashboard baseUrl="http://localhost:5000/api/v1/" />
        </div>
    );
};
export default Home;