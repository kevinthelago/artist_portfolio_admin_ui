import { useEffect, useState } from 'react';
import Album from './components/Album';
import './app.css';
import './reset.css';

const App = () => {
    const [artist, setArtist] = useState({
        albums: [],
        email: "",
        about: "",
        links: [],
        image: ""
    })

    useEffect(() => {
        const fetchArtist = async () => {
            fetch(
                process.env.REACT_APP_ARTISTS_URL + 
                process.env.REACT_APP_ARTIST_UUID
            )
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setArtist(data)
                })
                .catch(error => {
                    console.log(error);
                })
        }

        fetchArtist();
    }, []);

    return (
        <div id='app'>
            {artist.albums ? artist.albums.map(album => 
                <Album key={album.name} album={album} />
            ) : ""}
        </div>
    );
}

export default App;
