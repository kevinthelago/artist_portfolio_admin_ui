import { useEffect, useState } from 'react';
import Album from './components/Album';
import './app.css';
import './reset.css';

const EditableValue = (props) => {
    // const [value, setValue] = useState(props.value);

    // const handleChange = (event) => {
    //     setValue(event.target.value);
    // }

    return (
        <input autoFocus onChange={(e) => props.handleValueChange(e, props.property)} value={props.value} className='artist-card-value editable-value'>

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
            id={"artist-card-" + props.property.toLowerCase()}
        >
            <div className='artist-card-key'>
                {props.property}
            </div>
            {isEditing ?
                <EditableValue handleValueChange={props.handleValueChange} value={props.value} property={props.property} /> :
                <NoneEditableValue value={props.value} />
            }
        </div>
    )
}

const App = () => {
    const hiddenProperties = ["uuid", "albums", "pieces", "url"]
    const [albumCount, setAlbumCount] = useState(0);
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
            process.env.REACT_APP_ARTISTS_URL.slice(0, -1),
            {
                method: 'PUT',
                body: JSON.stringify(artist),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).then(response => 
            response.json()
        ).then(data => {
            setArtist(data)
        }).catch(error => 
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
            setAlbumCount(albumCount => albumCount + 1);
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
            setAlbumCount(albumCount => albumCount - 1);
        })
    }

    const handleValueChange = (event, property) => {
        artist[property] = event.target.value;
        setArtist(artist);
        setValue(value => value > 1 ? value - 1 : value + 1)
    } 

    return (
        <div id='app'>
            <div id='artist-card'>
                {Object.getOwnPropertyNames(artist).map(property => {
                    if (hiddenProperties.includes(property)) return "";
                    return <ArtistDetail
                        key={property}
                        property={property}
                        value={artist[property]}
                        updateArtist={updateArtist}
                        handleValueChange={handleValueChange}
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
