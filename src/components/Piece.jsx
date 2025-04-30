import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import './piece.css';

const EditableValue = (props) => {
    return (
        <input
            autoFocus
            placeholder={`type something for this piece's ${props.property}`}
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


const PieceDetail = (props) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleStopEditAndUpdate();
        }
    }

    const handleStopEditAndUpdate = () => {
        props.handleStopEdit();
        props.updatePiece();
    }

    return (
        <div
            onKeyDown={(e) => { handleKeyDown(e) }}
            onClick={() => { props.handleEditProperty(props.property) }}
            id={"album-card-" + props.property.toLowerCase()}
            className='list-item flexc'
        >
            <div className='list-item-key flexc'>
                {props.property}
            </div>
            {props.isEditing ?
                <EditableValue
                    value={props.value}
                    property={props.property}
                    handleValueChange={props.handleValueChange}
                    handleStopEditAndUpdate={handleStopEditAndUpdate}
                /> :
                <NoneEditableValue value={props.value} />
            }
        </div>
    )
}

const PieceBar = (props) => {
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
                    {props.piece.name}
                </div>
            }
        </div>
    )
}

const Piece = (props) => {
    const [piece, setPiece] = useState(props.piece);
    const [isOpen, setIsOpen] = useState(false);
    const [editingFields, setEditingFields] = useState({});

    useEffect(() => {
        setEditingFields(
            Object.getOwnPropertyNames(props.piece)
                .filter(property =>
                    !props.hiddenProperties.includes(property)
                ).reduce((acc, property) => {
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
        setPiece(piece => ({
            ...piece,
            [property]: event.target.value
        }));
    }

    const handleFileChange = (event, file) => {
        setPiece(piece => {
            const updatedPiece = {
                ...piece,
                file: file.name
            };
            props.updatePiece(updatedPiece);
            props.handleUploadImage(event, file);
            return updatedPiece;
        });
    }

    const open = () => {
        setIsOpen(true)
    }

    const close = () => {
        setIsOpen(false)
    }

    return (
        <div
            style={
                {
                    background: piece.file !== null ?
                        `url(${process.env.REACT_APP_IMAGES_URL}${props.artistUUID}/${piece.file})`
                        : ""
                }
            }
            className={isOpen ? "piece open" : "piece"}
            onClick={() => open()}
        >
            <PieceBar piece={piece} isOpen={isOpen} close={close} delete={() => props.deletePiece(props.piece.uuid)} />
            {isOpen ?
                <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            handleFileChange(e, file)
                        }
                    }}
                /> :
                ""
            }
            {isOpen ?
                <div className="piece-card">
                    {Object.getOwnPropertyNames(piece).map(property => {
                        if (props.hiddenProperties.includes(property)) return "";
                        return <PieceDetail
                            key={property}
                            property={property}
                            value={piece[property]}
                            isEditing={editingFields[property]}
                            handleEditProperty={handleEditProperty}
                            handleStopEdit={handleStopEdit}
                            handleValueChange={handleValueChange}
                            updatePiece={() => props.updatePiece(piece)}
                        />
                    })}
                </div> : ""}
        </div>
    )
}

export { Piece }
export default Piece
