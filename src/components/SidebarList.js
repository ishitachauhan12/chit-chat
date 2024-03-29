import { CircularProgress } from "@material-ui/core";
import { CancelOutlined, SearchOutlined } from "@material-ui/icons";
import "./SidebarList.css";
import SidebarListItem from './SidebarListItem'

export default function SidebarList({title,data}) {
  
  if(!data){
    <div className="loader__container siderbar__loader">
      <CircularProgress />
    </div>
  }

  if(!data.length && title==="Search Results"){
    return (
      <div className="no-result">
        <div>
          <SearchOutlined />
          <div className="cancel-root">
            <CancelOutlined />
          </div>
        </div>
        <h2>No {title}</h2>
      </div>
    )
  }
  return <div className="sidebar__chat--container">
    <h2>{title}</h2>
    {data.map(item=>(
      <SidebarListItem key={item.id} item={item}/>
    )
      
    )}
  </div>;
}
