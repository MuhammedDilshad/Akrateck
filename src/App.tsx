import { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import "./App.css";
import { CircularProgress } from "@mui/material";

interface User {
  email: string;
  picture: { thumbnail: string };
  name: { first: string; last: string };
}
const STORAGE_KEY = "userData";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeUsers = localStorage.getItem(STORAGE_KEY);
        if (storeUsers) {
          setUsers(JSON.parse(storeUsers) as User[]);
        } else {
          const response = await axios.get(
            "https://randomuser.me/api/?results=50"
          );
          const results = response.data;
          const allUser = results.results;
          setUsers(allUser as User[]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allUser));
        }
        setLoading(false);
      } catch (error) {
        console.error("Errors in fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleDelete = (emailToDelete: string) => {
    const updateUsers = users.filter((user) => {
      return user.email !== emailToDelete;
    });
    setUsers(updateUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updateUsers));
  };
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://randomuser.me/api/?results=50");
      const results = response.data;
      const allUser = results.results;
      setUsers(allUser as User[]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allUser));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <button className="RefreshButton" onClick={handleRefresh}>
            Refresh
          </button>
          <div style={{ margin: "20px 0", fontSize: "20px" }}>
            Total items: {users.length}
          </div>
          <div className="container">
            {users.map((user) => (
              <Card
                key={user.email}
                sx={{
                  // maxWidth: 300,
                  border: "10px solid #0000",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 1)",
                  // marginBottom: "20px",
                }}
              >
                <CardHeader avatar={<Avatar src={user.picture.thumbnail} />} />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {`${user.name.first} ${user.name.last}`}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <button onClick={() => handleDelete(user.email)}>
                    Delete
                  </button>
                </CardActions>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
