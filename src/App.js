import { useEffect, useState } from 'react';
import Album from './components/Album';
import './app.css';
import './reset.css';

const EditableValue = (props) => {
    const [value, setValue] = useState(props.value);

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    return (
        <input autoFocus onChange={(e) => handleChange(e)} value={value} className='artist-card-value editable-value'>

        </input>
    )
};

const NoneEditableValue = (props) => (
    <div className='artist-card-value none-editable-value'>
        {props.value}
    </div>
);

const ArtistDetail = (props) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleClick = () => {
        setIsEditing(true);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setIsEditing(false);
            props.updateArtist();
        }
    }

    return (
        <div
            onKeyDown={(e) => { handleKeyDown(e) }}
            onClick={() => { handleClick() }}
            id={"artist-card-" + props.title.toLowerCase()}
        >
            <div className='artist-card-key'>
                {props.title}
            </div>
            {isEditing ?
                <EditableValue value={props.value} /> :
                <NoneEditableValue value={props.value} />
            }
        </div>
    )
}

const App = () => {
    const hiddenProperties = ["uuid", "albums"]
    const [value, setValue] = useState(0);
    const [artist, setArtist] = useState({
        albums: [],
        email: "",
        about: "",
        links: [],
        image: ""
    })

    useEffect(() => {
        fetch(
            process.env.REACT_APP_ARTISTS_URL +
            process.env.REACT_APP_ARTIST_UUID
        ).then(response => 
            response.json()
        ).then(data => {
            setArtist(data)
        }).catch(error => {
            console.log(error);
        })
    }, []);

    const updateArtist = () => {
        fetch(
            process.env.REACT_APP_ARTISTS_URL + 
            artist.uuid,
            {
                method: 'PUT',
                body: JSON.stringify(artist)
            }
        ).then(response => 
            response.json()
        ).then(data => 
            setArtist(data)
        ).catch(error => 
            console.log(error)
        )
    }

    const createAlbum = () => {
        fetch(
            process.env.REACT_APP_ALBUMS_URL +
            process.env.REACT_APP_ARTIST_UUID,
            {
                method: 'POST',
                headers: {
                    "Accept": "application/json"
                }
            }
        ).then(response => 
            response.json()
        ).then(data => {
            artist.albums.push(data);
            setArtist(artist);
            setValue(value => value + 1);
        }).catch(error => 
            console.log(error)
        );
    }

    const deleteAlbum = (uuid) => {
        fetch(
            process.env.REACT_APP_ALBUMS_URL + uuid,
            {
                method: 'DELETE'
            }
        ).then(response => {
            artist.albums = artist.albums.filter(album => album.uuid !== uuid);
            setArtist(artist);
            setValue(value => value - 1);
        })
    }

    return (
        <div id='app'>
            <div id='artist-card'>
                {Object.getOwnPropertyNames(artist).map(property => {
                    if (hiddenProperties.includes(property)) return "";
                    return <ArtistDetail
                        key={property}
                        title={property}
                        value={artist[property]}
                        updateArtist={updateArtist}
                    />
                })}
            </div>
            <div id='albums'>
                {artist.albums?.map(album =>
                    <Album key={album.uuid} hiddenProperties={hiddenProperties} album={album} deleteAlbum={deleteAlbum}/>
                )}
                <button onClick={() => createAlbum()}>
                    Add Album
                </button>
            </div>
        </div>
    );
}

export default App;
