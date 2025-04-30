import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import Piece from './Piece';
import './album.css';

const EditableValue = (props) => {
    return (
        <input 
            autoFocus 
            placeholder={`type something for this album's ${props.property}`}
            onChange={(e) => props.handleValueChange(e, props.property)} 
            onBlur={() => props.handleStopEditAndUpdate()}
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

const AlbumDetail = (props) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleStopEditAndUpdate()
        }
    }

    const handleStopEditAndUpdate = () => {
        props.handleStopEdit();
        props.updateAlbum();
    }

    return (
        <div
            onKeyDown={(e) => { handleKeyDown(e) }}
            onClick={() => { props.handleEditProperty(props.property) }}
            id={"album-card-" + props.property.toLowerCase()}
            className="list-item flexc"
        >
            <div className='list-item-key'>
                {props.property}
            </div>
            {props.isEditing ?
                <EditableValue 
                value={props.value} 
                property={props.property} 
                handleValueChange={props.handleValueChange} 
                handleStopEditAndUpdate={handleStopEditAndUpdate}
                /> :
                <NoneEditableValue value={props.value} property={props.property} />
            }
        </div>
    )
}

const AlbumBar = (props) => {
    return (
        <div className="list-item-bar flexe">
            {props.isOpen ?
                <>  
                    <button 
                        className="close-list-item-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.delete();
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button 
                        className="close-list-item-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.close();
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </> :
                <div>
                    {props.album.name}
                </div>
            }
        </div>
    )
} 

const Album = (props) => {
    const [album, setAlbum] = useState(props.album);
    const [isOpen, setIsOpen] = useState(false);
    const [editingFields, setEditingFields] = useState({});

    useEffect(() => {
        setEditingFields(
            Object.getOwnPropertyNames(props.album)
                .filter(property => !props.hiddenProperties.includes(property))
                .reduce((acc, property) => {
                    acc[property] = false;
                    return acc
                }, {})
        );
    }, [])

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

    const handleValueChange = (event, property) => {
        setAlbum(album => ({
            ...album,
            [property]: event.target.value
        }));
    }

    const open = () => {
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
    }

    return (
        <div className={isOpen ? "album open" : "album"} onClick={() => open()}>
            <AlbumBar album={album} isOpen={isOpen} close={close} delete={() => props.deleteAlbum(props.album.uuid)}/>
            {isOpen ?
                <div className="album-card">
                    {Object.getOwnPropertyNames(album).map(property => {
                        if (props.hiddenProperties.includes(property)) return "";
                        return <AlbumDetail
                            key={property}
                            property={property}
                            value={album[property]}
                            isEditing={editingFields[property]}
                            handleEditProperty={handleEditProperty}
                            handleStopEdit={handleStopEdit}
                            handleValueChange={handleValueChange}
                            updateAlbum={() => props.updateAlbum(album)}
                        />
                    })}
                </div> : ""}
            {isOpen ?
                <div className="album-pieces">
                    {props.pieces?.map(piece => 
                        <Piece 
                            key={piece.uuid} 
                            artistUUID={props.artistUUID}
                            hiddenProperties={props.hiddenProperties} 
                            piece={piece} 
                            updatePiece={props.updatePiece}
                            deletePiece={props.deletePiece}
                            handleUploadImage={props.handleUploadImage}
                        />
                    )}
                    <button 
                        className="add-list-item-button flexc" 
                        onClick={() => props.createPiece(album.uuid)}
                    >
                        Add Piece
                    </button>
                </div>
                : ""}
        </div>
    )
}

export { Album };
export default Album;
