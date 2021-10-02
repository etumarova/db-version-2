import React from 'react';
import { Image } from 'cloudinary-react';

const PrintComponent = React.forwardRef((props, ref) => {
    const { data } = props;
    return (
        <div
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '10px' }}
            ref={ref}
        >
            {data.map(el => {
                return (
                    el && (
                        <div
                            style={{
                                display: 'flex',
                                flexFlow: 'column',
                                alignItems: 'center',
                                margin: '10px',
                                backgroundColor: '#191970',
                                color: 'white',
                                border: '2px solid grey',
                                borderRadius: '5px',
                                maxWidth: '450px',
                                padding: '30px',
                            }}
                        >
                            <h4>{el.comp}</h4>
                            <Image cloud_name="dgeev9d6l" publicId={el.photo} width="200" />
                            <div>
                                <h7>{el.school}</h7>
                                <h6>
                                    <b>{el.sportsmen}</b>
                                </h6>
                            </div>
                        </div>
                    )
                );
            })}
        </div>
    );
});

export default PrintComponent;
