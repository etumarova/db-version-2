import React, {useCallback, useEffect, useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        marginRight: '20px',
    },

}));

export default function FileInput({file, onChange, onClear}) {
    const [selectedFile, setSelectedFile] = useState();
    const buttonRef = useRef(null);
    const classes = useStyles();

    useEffect(() => {
        setSelectedFile({
            name: file.fileName,
        })
    }, [file, setSelectedFile]);

    const changeHandler = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            onChange(event);
        }
    }, [setSelectedFile]);

    const onClickEvent = useCallback(() => {
        buttonRef.current.click();
    }, []);

    const clearHandler =  useCallback(() => {
        onClear();
    }, [onClear]);

    return (
        <>
            <Typography variant="h5" component="h6" gutterBottom>
                Прикрепление файла
            </Typography>
            {
                selectedFile?.name ? (
                    <div className='load-or-clear'>
                        <Typography className={classes.root} paragraph={true} gutterBottom>
                            Название файла: <b>{selectedFile.name}</b>
                        </Typography>
                        <Button className={classes.root} variant="contained" color="primary" onClick={clearHandler}>Очистить файл</Button>
                    </div>
                ) : (
                    <div className='load-or-clear'>
                        <Typography className={classes.root} paragraph={true} gutterBottom>
                           Выберете файл!
                        </Typography>
                        <Button className={classes.root} variant="contained" color="primary" onClick={onClickEvent}>Прикрепить файл</Button>
                        <input className='hidden-button' ref={buttonRef} type="file" name="file" onChange={changeHandler}/>
                    </div>
                )
            }
        </>
    )
}