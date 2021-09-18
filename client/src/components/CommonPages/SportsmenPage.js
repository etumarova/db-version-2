import React from 'react';
import { Image } from 'cloudinary-react';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';

export default function SportsmenPage() {
    const sportsmen = JSON.parse(localStorage.getItem('sportsmen'));
    const result = JSON.parse(sportsmen.listResults);
    result.forEach((el,idx) => el['id'] = idx+1)
    const columns = [
      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'competition', headerName: 'Спортивное мероприятие', width: 600 },
      { field: 'discipline', headerName: 'Класс лодки', width: 130 },
      { field: 'place', headerName: 'Место', width: 95 },
    ];
    return (
        <div>
            {(sportsmen)&&(
              <div className="main-body">
                <div style={{ display:'flex', flexWrap:'nowrap'}}>
                <div className="row gutters-sm">
                  <div className="col-md-4 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex flex-column align-items-center text-center">
                            <Image cloud_name="dgeev9d6l" publicId={sportsmen.foto}  width="250" />
                            <Button variant="contained" size="small" color="primary" style={{margin: '5px'}} onClick={
                                (e)=>{
                                    e.preventDefault();
                                    window.location.assign('/createSportsmen');
                                }}>
                                Редактировать
                            </Button>
                        </div>
                      </div>
                    </div>
                  <div className="col-md-8" style={{marginLeft:'-15px'}}>
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">ФИО</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {sportsmen.name}
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Год рождения</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {sportsmen.birthday}
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Принадлежность</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {sportsmen.school}
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Личный тренер</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {sportsmen.nowTraner}
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Первый тренер</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {sportsmen.fTraner}
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Телефон</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {sportsmen.telephone}
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Адрес прописки</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {sportsmen.adress}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                
                {(result)&&
                  (<div style={{ height: 500, width: '100%' }}>
                  <DataGrid 
                      rows={result} 
                      columns={columns}
                      className='table-style'
                      pageSize={15} />
                  </div>)}
                </div>
            </div>
            )}
        </div>        
    )
}
