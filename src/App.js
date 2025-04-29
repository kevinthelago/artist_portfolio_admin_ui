import { useEffect, useState } from 'react';
import Album from './components/Album';
import './app.css';
import './reset.css';

const EditableValue = (props) => {
    return (
        <input 
            autoFocus
            onChange={(e) => props.handleValueChange(e, props.property)} 
            value={props.value === null ? "" : props.value} 
            className='list-item-value editable-value'
        />
    )
};

const NoneEditableValue = (props) => (
    <div className='list-item-value none-editable-value'>
        {props.value}
    </div>
);

const ArtistDetail = (props) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            props.handleStopEdit();
            props.updateArtist();
        }
    }

    return (
        <div
            onKeyDown={(e) => { handleKeyDown(e) }}
            onClick={() => { props.handleEditProperty(props.property) }}
            id={"artist-card-" + props.property.toLowerCase()}
            className='list-item flexc'
        >
            <div className='list-item-key'>
                {props.property}
            </div>
            {props.isEditing ?
                <EditableValue handleValueChange={props.handleValueChange} value={props.value} property={props.property} /> :
                <NoneEditableValue value={props.value} />
            }
        </div>
    )
}

const App = () => {
    const hiddenProperties = ["uuid", "albums", "pieces", "url", "file"]
    const [editingFields, setEditingFields] = useState({});
    const [albumRerenderCount, setAlbumRerenderCount] = useState(0);
    const [pieceRerenderCount, setPieceRerenderCount] = useState(0);
    const [value, setValue] = useState(0);
    const [artist, setArtist] = useState({
        albums: [],
        email: "",
        about: "",
        links: [],
        image: ""
    });
    // albumRerenderCount, pieceRerenderCount, value;

    useEffect(() => {
        fetch(
            process.env.REACT_APP_ARTISTS_URL +
            process.env.REACT_APP_ARTIST_UUID
        ).then(response =>
            response.json()
        ).then(data => {
            setArtist(data);
            setEditingFields(
                Object.getOwnPropertyNames(artist)
                    .filter(property => !hiddenProperties.includes(property))
                    .reduce((acc, property) => {
                        acc[property] = false;
                        return acc
                    }, {})
            );
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
            setAlbumRerenderCount(albumRerenderCount => albumRerenderCount + 1);
        }).catch(error =>
            console.log(error)
        );
    }

    const updateAlbum = (album) => {
        fetch(
            process.env.REACT_APP_ALBUMS_URL.slice(0, -1),
            {
                method: 'PUT',
                body: JSON.stringify(album),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).catch(error =>
            console.log(error)
        )
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
            setAlbumRerenderCount(albumRerenderCount => albumRerenderCount - 1);
        })
    }

    const createPiece = (uuid) => {
        fetch(
            process.env.REACT_APP_PIECES_URL + uuid,
            {
                method: 'POST',
                headers: {
                    "Accept": "application/json"
                }
            }
        ).then(response =>
            response.json()
        ).then(data => {
            console.log(artist)
            let album = artist.albums.find(album => album.uuid === uuid);
            album.pieces.push(data);

            console.log(artist)
            setPieceRerenderCount(pieceCount => pieceCount + 1)
        }).catch(error =>
            console.log(error)
        )
    }

    const updatePiece = (piece) => {
        fetch(
            process.env.REACT_APP_PIECES_URL.slice(0, -1),
            {
                method: 'PUT',
                body: JSON.stringify(piece),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).catch(error =>
            console.log(error)
        )
    }

    const deletePiece = (uuid) => {
        fetch(
            process.env.REACT_APP_ALBUMS_URL + uuid,
            {
                method: 'DELETE'
            }
        ).then(response =>
            console.log(response)
        ).catch(error =>
            console.log(error)
        )
    }

    const handleValueChange = (event, property) => {
        artist[property] = event.target.value;
        setArtist(artist);
        // This stupid little bit of math is just to force re-render for a state that only checks object reference
        setValue(value => value > 1 ? value - 1 : value + 1);
    }

    const handleEditProperty = (property) => {
        handleStopEdit()
        setEditingFields(editingFields => ({
            ...editingFields,
            [property]: true
        }))
    }

    const handleStopEdit = () => {
        setEditingFields(prev => 
            Object.getOwnPropertyNames(prev)
            .reduce((acc, property) => {
                acc[property] = false;
                return acc
            }, {})
        )
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
                        isEditing={editingFields[property]}
                        updateArtist={updateArtist}
                        handleValueChange={handleValueChange}
                        handleEditProperty={handleEditProperty}
                        handleStopEdit={handleStopEdit}
                    />
                })}
            </div>
            <div id='albums'>
                Albums
                {artist.albums?.map(album =>
                    <Album
                        key={album.uuid}
                        hiddenProperties={hiddenProperties}
                        album={album}
                        createPiece={createPiece}
                        updatePiece={updatePiece}
                        deletePiece={deletePiece}
                        updateAlbum={updateAlbum}
                        deleteAlbum={deleteAlbum}
                    />
                )}
                <button
                    className="add-list-item-button flexc"
                    onClick={() => createAlbum()}
                >
                    Add Album
                </button>
            </div>
        </div>
    );
}

export default App;
