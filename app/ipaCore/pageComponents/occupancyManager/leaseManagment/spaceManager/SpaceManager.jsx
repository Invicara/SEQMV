import React, { useState, useEffect } from "react";
import { makeStyles } from '@mui/styles';
import { CircularProgress,Backdrop ,MenuItem,Select,Card,Grid,Container,Popper,ClickAwayListener} from "@mui/material"
import { ScriptHelper ,ScriptCache } from '@invicara/ipa-core/modules/IpaUtils'
import Pagination from '../../components/Pagination';
import './SpaceManager.scss'
import { GenericMatButton } from "@invicara/ipa-core/modules/IpaControls";
import _ from "lodash";
import CreateEntity from "../modal/CreateEntity";
import Notification from "../../components/Notification";
import UnallocateSpace from "../modal/UnallocateSpace";
import EditSpace from "../modal/EditSpace";
import MoveUser from "../modal/MoveUser";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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

const SpaceManager = (props) => {
//console.log(props,'props--');
const classes = useStyles();

const [issues, setIssues] = useState([])
const [checkBoxSelected, setCheckBoxSelected] = useState(false)
const [open, setOpen] = useState(false)
const [allAssets, setAllAssets] = useState([])
const [pageCount, setPageCount] = useState(10);
const [currentPage, setCurrentPage] = useState(1)
const [searchTerm, setSearchTerm] = useState("");
const [advSearchText, setAdvSearchText] = useState('')
const [editMode, setEditMode] = useState(false)
const [moveMode, setMoveMode] = useState(false)
const [createMode, setCreateMode] = useState(false)
const [unallocateMode, setUnallocateMode] = useState(false)
const [inputs, setInputs] = useState({});
const [currentEntity, setCurrentEntity] = useState({})
const [temps, setTemps] = useState({})
const [anchorEl, setAnchorEl] = useState(null);
const [mode, setMode] = useState('')
const [notificationMsg, setNotificationMsg] = useState('')
const [successErrorMsg, setSuccessErrorMsg] = useState('')
const [condition, setCondition] = useState('');
const [filterHead, setFilterHead] = useState('')
const [openAdvFilterPanel, setOpenAdvFilterPanel] = useState(false)
const [notifyState, setNotifyState] = useState({
  openMsg: false,
  vertical: 'top',
  horizontal: 'right',
});

  const [leaseData, setleaseData] = useState([]);
  const [activeLeaseData, setActiveLeaseData] = useState([]);

  const getAllSpaces = async () => {
    console.log(props.handler.config.entityData, 'getAllSpaces');

    setOpen(!open)
    ScriptCache.clearCache();
    const leaseSpaceData = await ScriptCache.runScript(props.handler.config.entityData.getLeaseSpaces.script, {});
    console.log('get lease spaces :---->', leaseSpaceData);
    setleaseData(leaseSpaceData);

    const activeLeaseSpaces = (leaseSpaceData || []).filter(
      item => item.properties?.['Rental Status']?.val === 'TRUE'
    );
    console.log('Active lease spaces :---->', activeLeaseSpaces);
    setActiveLeaseData(activeLeaseSpaces)
    setOpen(false)
  }

    useEffect(()=>{
      getAllSpaces()
    },[])

    //console.log(currentProject,'currentProj');
    const pageSizes = [10,20,30,40,50]

      const handleChange = (event) => {
        setCondition(event.target.value , 'setage');
        
      };
      const handleSetHead = (e) => {
        console.log(e.target.value,'hanldeset')
        setFilterHead(e.target.value)
      }


      //Function for notification
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
        setNotifyState({ openMsg: true, vertical:'top', horizontal: 'right' });
        setTimeout(() => {
          handleCloseMsg()
        }, 5000);
      };
    
      const handleCloseMsg = () => {
        setNotifyState({ ...notifyState, open: false });
      };


      const handleSelectRow = (event) => {
        setPageCount(event.target.value);
      };
      //const filteredDatas = []
      const createEntity = () => {
        console.log('Create Entity');
        setCreateMode(true)
      }
      const editItems = () => {
        console.log('editItems')
        setMode('edit')
        setEditMode(true)
        setInputs(currentEntity)
      }
      const unallocateItem = () => {
        console.log('removeItems');
        setMode('delete')
        setUnallocateMode(true)
      }
      const moveUser = () => {
        setMode('move')
        setMoveMode(true)
        console.log('move Item');
      }
      Array.prototype.filterTableData = function() {
        if(!advSearchText.length > 0){
          return this
        }
        let newArr = []
        if(advSearchText !== '' && condition !== '' && filterHead !== ''){
                    switch(condition){
            case 'contains':
              newArr.push(this.filter(asset => asset.properties[filterHead]?.val.toLowerCase().includes(advSearchText)))
              break;
            case 'not contains':
              newArr.push(this.filter(asset => !asset.properties[filterHead]?.val.toLowerCase().includes(advSearchText)))
              break;
            case 'starts with':
              newArr.push(this.filter(asset => asset.properties[filterHead]?.val.toLowerCase().startsWith(advSearchText.toLowerCase())))
              break;
            case 'ends with':
              newArr.push(this.filter(asset => asset.properties[filterHead]?.val.toLowerCase().endsWith(advSearchText.toLowerCase())))
              break;
            case 'is':
              newArr.push(this.filter(asset => asset.properties[filterHead]?.val.toLowerCase() === advSearchText.toLowerCase()))
              break; 
            case 'is not':
              newArr.push(this.filter(asset => asset.properties[filterHead]?.val.toLowerCase() !== advSearchText.toLowerCase()))
              break;   
          }
        }        
        
        return newArr.length > 0 ? [...new Set(newArr.flat())] : this
      };
      const filteredDatas = activeLeaseData.filter(
          (asset) =>
            asset.properties['Customer Name']?.val && asset.properties['Customer Name']?.val.toLowerCase().includes(searchTerm.toLowerCase()) || asset['Space Name']?.toLowerCase().includes(searchTerm.toLowerCase()))
        .filterTableData(data => data)

      const firstPageIndex = currentPage * pageCount;
      const lastPageIndex = firstPageIndex - pageCount;
      const currentPsts = filteredDatas.slice(lastPageIndex, firstPageIndex);
      const openPopper = Boolean(anchorEl);
      const id = openPopper ? 'simple-popper' : undefined;
      const handleClose = () => {
        setAnchorEl(null)
      }
      const handleTableAction = (event, currSpace, i) => {
        console.log('current space :---->',currSpace)
        setCurrentEntity(currSpace)
        // console.log(event,'event--');
        // console.log(currAsset,'currAsset');
        // let userEntity = []
        // userEntity[0]= {entity : currAsset}
        // setUserInfo(userEntity)
        setAnchorEl(anchorEl ? null : event.currentTarget);
      };
      const isSuccessOrFailMsg = (msg) => {
        console.log(msg,'msg');
        if(msg.success === true){
          setNotificationMsg(msg.modalForm +' '+ msg.action + ' Successfully!')
          notify('success')
          getAllSpaces()
        } else {
          notify('error')
        }
      }

      const coloringStatus = (colorCode) => {
        if(colorCode === 'New' || colorCode === 'new'){
          return 'success'
        } else if(colorCode === 'Pending' || colorCode === 'pending'){
          return 'warning'
        } else {
          return 'danger'
        }
      }

      const conditions = [
        'contains',
        'not contains',
        'starts with',
        'ends with',
        'is',
        'is not'
      ]
      const openAdvFilter = () => {
        setOpenAdvFilterPanel(true)
      }
      const resetFilter = () => {
        setOpenAdvFilterPanel(false)
        setFilterHead('')
        setCondition('')
        setAdvSearchText('')
      }

return (
  // <div>
  //   <h1>hello in side..</h1>
  // </div>
  <Container component="main" maxWidth="xxl">
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <div style={{ display: 'flex', width: '100%', marginTop: '25px' }}>
          <div style={{ width: '50%' }}>
            {/* <h4>All {props.handler.config.type.plural}</h4> */}
            <h4>Space Management</h4>
          </div>
          <div style={{ textAlign: 'right', width: '50%' }}>
            <GenericMatButton styles={{ fontSize: '12px' }} customClasses={'attention'} onClick={createEntity} autoFocus>
              Allocate Space
            </GenericMatButton>
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%', marginTop: '25px' }}>
          <div style={{ width: '25%' }} className='custsearch advanceFilter'>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /><i className='fa fa-search'></i>

            {/* <Autocomplete
                          disablePortal
                          options={optionsForFilter}
                          sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} label="Attributes" />}
                        /> */}
          </div>
          {/* <div className="adv-filter-panel" style={{ width: '65%' }}>
            <GenericMatButton styles={{ fontSize: '12px' }} customClasses={openAdvFilterPanel ? 'toggleAdvfilter' : ''} onClick={openAdvFilter} autoFocus>
              <i className="fas fa-list"></i> <span className="advfilter">Advance Filter</span>
            </GenericMatButton>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              className="selectAttr"
              style={{ marginLeft: '20px', display: openAdvFilterPanel ? '' : 'none' }}
              value={filterHead}
              onChange={handleSetHead}
            >
              {props.handler.config.tableView.component.columns.map(attr => <MenuItem key={attr.name} value={attr.name}>{attr.name}</MenuItem>)}
            </Select>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              className="selectAttr"
              style={{ display: openAdvFilterPanel ? '' : 'none' }}
              value={condition}
              onChange={handleChange}
            >
              {conditions.map(condition => <MenuItem key={condition} value={condition}>{condition}</MenuItem>)}
            </Select>
            <input
              type="text"
              placeholder="Enter text"
              className="advsearch-input"
              style={{ width: '180px', display: openAdvFilterPanel ? '' : 'none' }}
              value={advSearchText}
              onChange={(e) => setAdvSearchText(e.target.value)}
            />
            <button style={{ display: openAdvFilterPanel ? '' : 'none' }} onClick={resetFilter}><i class="fa fa-undo"></i></button>
          </div> */}
        </div>

        <div>
          <div className="pagination-bar-custom">
            <div className="leftAlign">
              <label>Items per page:</label>
              <select
                className="item-per-page"
                value={pageCount}
                onChange={handleSelectRow}
                name="pageCount"
              >
                {pageSizes.map(page => <option key={page} value={page}>{page}</option>)}
              </select>

              <label style={{ marginLeft: '25px' }}>{currentPage}-{pageCount} of {activeLeaseData.length} items </label>
            </div>
            <div className="rightAlign">
              {/* <label>{currentPage} of {Math.ceil(activeLeaseData.length / pageCount)}</label> */}
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={activeLeaseData.length}
                pageSize={pageCount}
                onPageChange={page => setCurrentPage(page)}
              />
            </div>
          </div>
          {activeLeaseData.length > 0 ? <table className='tableCustom'>
            <thead>
              <tr style={{ background: '#f2f2f2' }}>
                {props.handler.config.tableView.component.columns.map(colHead => {
                  return (
                    <th key={colHead.name}>{colHead.name}</th>
                  )
                })}
                <th style={{ width: '8%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPsts.map((space, index) => {
                return (
                  <tr key={index}>
                    {props.handler.config.tableView.component.columns.map(col => {
                        return (
                          <td key={col.accessor}>{space.properties[col.accessor].val}</td>
                        )
                    })}
                    <td key={'action' + index} style={{ width: '8%' }}>
                      <i className="fa fa-ellipsis-v" aria-describedby={id} onClick={(e) => handleTableAction(e, space, index)}></i>
                      <Popper id={id} open={openPopper} anchorEl={anchorEl} placement={'bottom-end'}>
                        <ClickAwayListener onClickAway={handleClose}>
                          <Card style={{ marginTop: '10px' }} variant='outlined'>
                            <MenuItem onClick={editItems}>Edit Space</MenuItem>
                            <MenuItem onClick={unallocateItem}>Unallocate Space</MenuItem>
                            <MenuItem onClick={moveUser}>Move User</MenuItem>
                          </Card>
                        </ClickAwayListener>
                      </Popper>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table> : 'No Data'}
          <div style={{ textAlign: 'center', display: activeLeaseData.length == 0 ? 'block' : 'none' }}>
            <p>No Data</p>
          </div>
          <div className='pagination-row'>
          </div>

        </div>
        {/* </CardContent>
                    </Card> */}
      </Grid>
    </Grid>

    <div>
      <Backdrop className={classes.backdrop} open={open} onClick={() => { }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* <EntityModalForView 
        mode={mode}
        {...props}
        isOpen={editMode}
        isSuccessOrFailMsg={isSuccessOrFailMsg}
        onClose={() => setEditMode(false)}
        userInfo={currentEntity}
      /> */}
      <MoveUser
        {...props}
        isOpen={moveMode}
        isSuccessOrFailMsg={isSuccessOrFailMsg}
        onClose={() => setMoveMode(false)}
        userInfo={currentEntity}
        spaceInfo ={leaseData}
      />
      <EditSpace
        {...props}
        isOpen={editMode}
        isSuccessOrFailMsg={isSuccessOrFailMsg}
        onClose={() => setEditMode(false)}
        userInfo={currentEntity}
      />
      <CreateEntity
        {...props}
        isOpen={createMode}
        isSuccessOrFailMsg={isSuccessOrFailMsg}
        onClose={() => setCreateMode(false)}
        spaceInfo ={leaseData}
      />
      <UnallocateSpace
        {...props}
        isOpen={unallocateMode}
        isSuccessOrFailMsg={isSuccessOrFailMsg}
        onClose={() => setUnallocateMode(false)}
        userInfo={currentEntity}
      />
      <Notification
        open={notifyState.openMsg}
        onClose={() => setNotifyState({ openMsg: false, vertical: 'top', horizontal: 'right' })}
        message={notificationMsg}
        successOrErr={successErrorMsg}
      />
    </div>
  </Container>
)
}

export default SpaceManager