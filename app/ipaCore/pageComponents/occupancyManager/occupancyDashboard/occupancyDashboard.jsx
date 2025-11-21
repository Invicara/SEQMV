import React, { useEffect, useState, useMemo } from 'react';
import { ScriptHelper } from '@invicara/ipa-core/modules/IpaUtils'
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import './mobilityview.scss'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Checkbox from '@mui/material/Checkbox';

import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import {IafProj} from '@dtplatform/platform-api';
import Pagination from './components/Pagination';
import MoveUserModal from "../modal/MoveUserModal";
import AssignAndUnassignUser from '../modal/AssignAndUnassignUser';
import Notification from '../modal/Notification';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      marginTop: '30px'
    },
    paper: {
      border: '1px solid grey',
      padding: theme.spacing(1),
      backgroundColor: 'white',
    },
    table: {
      width: '100%',
      border: '1px solid #ddd'
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    root2: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
      },
    chartHeight:{
        height: '150px'
    },
    cardMargin: {
        marginTop: '10px'
    },
    cardMargin2: {
      marginTop: '10px',
      width: '50%'
    },
    dividerFullWidth: {
        margin: `5px 0 0 ${theme.spacing(2)}px`,
    },
    flexRow : {display: 'flex'},
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));
  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function InviCards(props) {
    //console.log(props,'props--');
    const getPercentage = () => {
        let percentageVal = props.availabledesk / props.totaldesk *100
        return percentageVal.toFixed(2)
    }
    return (
        <>
        <Card className='cardMargin' variant='outlined'>
                    <div>
                        <h5 className='invh5'><i className='fas fa-user invicon'></i> {props.roomname}</h5>
                        </div>
                        <Divider />
                        <h1 style={{color: props.availabledesk > 0 ? '#48A045' : '#D32F2F', textAlign:'center'}}>{props.availabledesk} <span style={{fontSize: '12px'}}>Workstations Available</span></h1>
                        <div className='custsearch' style={{marginTop:'20px', marginBottom: '10px'}}>
                            <div style={{marginLeft:'15px', width: '50%'}}>Total Workstations: {props.totaldesk}</div>
                            <div style={{color: getPercentage() > 0 ? '#48A045' : '#D32F2F', textAlign:'right'}}>Assigned: {100 - getPercentage()}%</div>
                        </div>
        </Card>
        </>
    )
}
const occupancyDashboard = (props) => {
  //console.log(props,'props--');

  const [open, setOpen] = React.useState(false);
  const [allAssets, setAllAssets] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [occupancyName, setOccupancyName] = useState([])
  const [checkBoxSelected, setCheckBoxSelected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = React.useState(10);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false)
  const [userInfo, setUserInfo] = useState([])
  const [notificationMsg, setNotificationMsg] = useState('')
  const [successErrorMsg, setSuccessErrorMsg] = useState('')
  const [state, setState] = useState({
    openMsg: false,
    vertical: 'top',
    horizontal: 'right',
  });

  const handleSelectRow = (event) => {
    setPageCount(event.target.value);
    //setCurrentPage(1)
  };

    const classes = useStyles();
    const getAllAssets = async () => {
      setOpen(!open)
        let getCollectionsDatas = await ScriptHelper.executeScript(props.handler.script.getOccupancyAssets, { entityInfo: {}})
        //console.log(getCollectionsDatas,'getCollectionsDatas');
        setAllAssets(getCollectionsDatas)
        setOpen(false)
      }

    const current_proj = () => {
      let current = IafProj.getCurrent()
      console.log(current,'curr')
      return current._name
    };
    useEffect(()=>{
      getAllAssets()
    },[])

    //console.log(currentProject,'currentProj');
    const pageSizes = [10,20,30,40,50]
    
    const uniqueDatas = (attr) => {
      return [...new Set(allAssets.filter(assetData => assetData.properties[attr].val).map(item => item.properties[attr].val))];
    }

    const occupiedCount = allAssets.filter(asset => asset.properties.Occupied.val == 'Yes')
    const availableCount = allAssets.filter(asset => asset.properties.Occupied.val == 'No').length
    const occupiedPercent = occupiedCount.length / allAssets.length * 100
    const availablePercent = availableCount / allAssets.length * 100
    
    const scaleArr = () => {
      let singleVal = Math.ceil(allAssets.length/9)
      let arr = []
      for(let i=1; i < 10; i++){
      arr.push(i*singleVal)
      }
          return arr
      }

      const handleTableAction = (event, currAsset, i) => {
        console.log(event,'event--');
        console.log(currAsset,'currAsset');
        let userEntity = []
        userEntity[0]= {entity : currAsset}
        setUserInfo(userEntity)
        setAnchorEl(anchorEl ? null : event.currentTarget);
      };

      const handleClose = () => {
        setAnchorEl(null)
      }

      const openPopper = Boolean(anchorEl);
      const id = openPopper ? 'simple-popper' : undefined;
    
      const handleChange = (event) => {
        const {
          target: { value },
        } = event;

        if(value.includes('all')){
          setCheckBoxSelected(true)
          setOccupancyName(['all']);
        } else{
          setCheckBoxSelected(false)
          setOccupancyName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
        }
        
      };

      Array.prototype.filterTableData = function() {
        if(occupancyName.includes('all')){
          return this
        }
        let newArr = []
        for(let i=0; i < occupancyName.length; i++){
            newArr.push(this.filter(asset => asset.properties['Office'].val == occupancyName[i] || asset.properties['Cabin'].val == occupancyName[i]))
        }
        console.log(newArr,'newArr--');
        
        return newArr.length > 0 ? [...new Set(newArr.flat())] : this
      };

      const getTop5Rooms = () => {
        let top5Rooms = occupiedCount.filter(asset => asset.properties['Office'].val)
        //console.log(top5Rooms,'top5Rooms');
    
        let counter = {}
        top5Rooms.forEach(function(obj) {
            var key = obj.properties['Office'].val
            counter[key] = (counter[key] || 0) + 1
        })
        
        console.log(counter,'counter')
        
        let roomsWithCounts = []
        for (var roomName in counter) {
          let topPercentDatas = counter[roomName]/getTotalDesks(roomName) * 100
          roomsWithCounts.push([roomName, topPercentDatas]);
        }
        
        roomsWithCounts.sort(function(a, b) {
            return b[1] - a[1];
        });
        console.log(roomsWithCounts,'roomsWithCounts');
        
        return roomsWithCounts
       }
      
       const getTotalDesks = (desk) => {
        return allAssets.filter(asset => asset.properties['Office'].val == desk).length
       }
       const getAvailableDesk = (available) => {
        return allAssets.filter(asset => asset.properties['Office'].val == available && asset.properties.Occupied.val == 'No').length
       }
    
       const donwnLoadCsv = () => {
        //console.log('downloadcsv');
        let fileName = 'DashboardTable_'+ current_proj()
        //console.log(fileName,'filenmae');
        
            // Convert the data array into a CSV string
            // let keys = []
            // keys[0] = 'Asset Name'
            // keys.push(Object.keys(allAssets[0].properties))
            let flatkeys = ['Occupant','Office','Cabin','Workstation No']
            //keys.flat()
            //console.log(keys,'keys');
            
            let sheetData = allAssets.map(item => {
              // item.properties['Asset Name'] = {}
              // item.properties['Asset Name'].val = item['Entity Name']
              let temp = []
              for(let i=0; i < flatkeys.length; i++){
                    temp.push(item.properties[flatkeys[i]]?.val == undefined ? '': item.properties[flatkeys[i]]?.val)
              }
              return temp
            })
            //console.log(sheetData,'sheetData');
            
            const csvString = [
              flatkeys, // Specify your headers here
              ...sheetData // Map your data fields accordingly
            ]
            .map(row => row.join(","))
            .join("\n");

            //console.log(csvString,'csvString');
            
            //console.log(csvString,'csvString');
            
            // // Create a Blob from the CSV string
            const blob = new Blob([csvString], { type: 'text/csv' });

            // Generate a download link and initiate the download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'DashboardTable.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        
       }
       const filteredDatas = allAssets.filter(
          (asset) =>
            asset.properties['Occupant']?.val && asset.properties['Occupant']?.val.toLowerCase().includes(searchTerm.toLowerCase()))
        .filterTableData(data => data)

      const firstPageIndex = currentPage * pageCount;
      const lastPageIndex = firstPageIndex - pageCount;
      const currentPsts = filteredDatas.slice(lastPageIndex, firstPageIndex);

      const moveUser = () => {
        console.log('move user clicked');
        setIsMoveModalOpen(true)
        
      }
      const unassignedUser = () => {
        console.log('unassigned user clicked');
        setIsUnassignModalOpen(true)
      }

      const notify = (msg) => {
        let headerStyle = document.getElementsByClassName("titlebar-header");
        //console.log(headerStyle[0].style,'hader--')
        console.log('Notification!');
        
        headerStyle[0].style.zIndex = -1
        if(msg == 'Success' || msg == 'success'){
          setSuccessErrorMsg('Success')
        } else {
          setNotificationMsg('Something went wrong!')
          setSuccessErrorMsg('Error')
        }
        setState({ openMsg: true, vertical:'top', horizontal: 'right' });
        setTimeout(() => {
          handleCloseMsg()
        }, 5000);
      };
    
      const handleCloseMsg = () => {
        setState({ ...state, open: false });
      };

      const isMoved = (moved) => {
        console.log(moved,'moved==');
        if(moved == true){
          getAllAssets()
          setNotificationMsg('Occupant has been moved successfully!')
          notify('success')
        } else {
          notify('error')
        }
      }
      const isUnassigned = (unassigned) => {
        console.log(unassigned,'unassigned--');
        getAllAssets()
        if(unassigned.success === true && unassigned.modal === 'Unassign'){
          setNotificationMsg('Workstation has been Unassigned successfully!')
          notify('success')
        } else {
          notify('error')
        }
      }
      
       
    return(
        <Container component="main" maxWidth="xxl">
        <div className={classes.root}>
        <div className={classes.flexRow} style={{marginTop:'20px', height: '45px', width:'100%'}}>
          <div style={{width:'75%'}}>
          <h3 style={{height:'45px'}}>Good Morning, {props.user._firstname}</h3>
          </div>
          <div style={{width:'25%', textAlign: 'right'}}>
          <button onClick={donwnLoadCsv} className="inv-action-button"><i className="fas fa-download" title="Export Data"></i></button>
          </div>
          </div>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Card className={classes.cardMargin} variant='outlined'>
            <div>
                <h5 className='invh5'><i className='fas fa-user invicon'></i>Today's current assigned workstations</h5>
                </div>
                <Divider />
                <CardContent>
                <div className='custsearch'>
                <input
                  type="text"
                  placeholder="Search Occupant"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                /><i className='fa fa-search'></i>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={occupancyName}
                        onChange={handleChange}
                        displayEmpty
                        renderValue={(selected) => {
                          if(selected.length === 0){
                            return <em className='invfilter'>Filter by</em>;
                          }
                          if(selected.includes('all')){
                            return 'Filter by(All)'
                          } else{
                            return 'Filter by('+ selected.join(', ') + ')'
                          }
                        }}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value='all'>
                            <Checkbox checked={occupancyName.includes('all')} />
                            <ListItemText primary={'All'} />
                          </MenuItem>
                        <ListSubheader>Office</ListSubheader>
                        {uniqueDatas('Office').map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={checkBoxSelected ? false: occupancyName.includes(name)} disabled={checkBoxSelected} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                        <ListSubheader>Cabin</ListSubheader>
                        {uniqueDatas('Cabin').map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox checked={checkBoxSelected ? false: occupancyName.includes(name)} disabled={checkBoxSelected} />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                </div>
                <div style={{overflowX:'hidden'}}>
                {allAssets.length > 0 ? <table className='table'>
                  <thead>
                  <tr>
                    <th>Occupant</th>
                    <th>Office</th>
                    <th>Cabin</th>
                    <th>Workstation No</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {currentPsts.map((asset,index) => {
                    return(
                      <tr key={index}>
                        <td>{asset.properties['Occupant'].val}</td>
                        <td>{asset.properties['Office'].val}</td>
                        <td>{asset.properties['Cabin'].val}</td>
                        <td>{asset.properties['Workstation No'].val}</td>
                        <td>
                          <i className="fa fa-ellipsis-v" aria-describedby={id} onClick={(e) => handleTableAction(e, asset, index)}></i>
                          <Popper id={id} open={openPopper} anchorEl={anchorEl} placement={'bottom-end'}>
                          <ClickAwayListener onClickAway={handleClose}>
                            <Card className={classes.cardMargin} variant='outlined'>
                            <MenuItem onClick={moveUser}>Move Occupant</MenuItem>
                            <MenuItem onClick={unassignedUser}>Unassign Workstation</MenuItem>
                            </Card>
                            </ClickAwayListener>
                          </Popper>
                          </td>
                      </tr>
                    ) 
                  })}
                  </tbody>
                </table> : 'No Data'}
                <div style={{textAlign: 'center',display: filteredDatas.length == 0 ? 'block' : 'none'}}>
                  <p>No Workstation is Assigned</p>
                </div>
                <div className='pagination-row'>
                  <label>Rows</label>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={pageCount}
                  onChange={handleSelectRow}
                >
                  {pageSizes.map(page => <MenuItem key={page} value={page}>{page}</MenuItem>)}
                </Select>
                <Pagination  
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={filteredDatas.length}
                    pageSize={pageCount}
                    onPageChange={page => setCurrentPage(page)}
                  />
                </div>

                </div>
                </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className={classes.cardMargin} variant='outlined'>
                <div>
                <h5 className='invh5'><i className='fa fa-file-image invicon'></i>Today's assigned workstations vs available workstations</h5>
                </div>
                <Divider />
                <CardContent>
                    <div className={classes.flexRow}>
                        <div className={classes.chartHeight} style={{background:'#D32F2F', width: occupiedPercent.toFixed(2) + '%' }}></div>
                        <div className={classes.chartHeight} style={{background:'#48A045', width: availablePercent.toFixed(2) + '%'}}></div>
                    </div>
                    <div className={classes.flexRow}>
                      <p style={{width:'2%'}}>0</p>
                      {scaleArr().map((i) => <p style={{width:'10.8%', textAlign:'right'}}>{i}</p>)}
                    </div>
                    <div className={classes.flexRow} style={{marginTop:'20px'}}>
                        <div style={{width:'50%', textAlign:'right', marginRight:'10px'}}><i className="fa fa-circle" style={{color:'#D32F2F'}} aria-hidden="true"></i>{occupiedCount.length} Assigned</div>
                        <div style={{width:'50%', textAlign:'left'}}><i className="fa fa-circle" style={{color:'#48A045'}} aria-hidden="true"></i>{availableCount} Available</div>
                    </div>
                </CardContent>
            </Card>
            <Grid container spacing={3}>
              {getTop5Rooms().slice(0,5).map(topRoom => {
              return(
                <Grid item xs={6}>
                          <InviCards roomname={topRoom[0]} totaldesk={getTotalDesks(topRoom[0])} availabledesk={getAvailableDesk(topRoom[0])} />
                          </Grid>
              )
              })}
            </Grid>
          </Grid>
        </Grid>
      </div>
      {/* Move user model */}
      <MoveUserModal
        {...props}
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        userInfo={userInfo}
        onTextSearch={''}
        assetClickType={'dashboard'}
        isMoved={isMoved}
      />
      {/*Unassign and Assign User */}
      <AssignAndUnassignUser
        {...props}
        isOpen={isUnassignModalOpen}
        onClose={() => setIsUnassignModalOpen(false)}
        userInfo={userInfo}
        isUnassigned={isUnassigned}
      />
      <div>
      <Backdrop className={classes.backdrop} open={open} onClick={() => {}}>
        <CircularProgress color="inherit" />
      </Backdrop>
      </div>
      <div>
    <Notification 
      open={state.openMsg}
      onClose={() => setState({openMsg: false, vertical:'top', horizontal: 'right'})}
      message={notificationMsg}
      successOrErr={successErrorMsg}
      />
    </div>
      </Container>
    )
}

export default occupancyDashboard