import { NavLink } from "react-router-dom";
import ProfilePicture from "../../components/ProfilePicture";
import { menuItems } from "../../constants/constants";
import { LucideLogOut } from "lucide-react";
import { useAuthClientStore } from "../../clients/authClientStore";
import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function SideBar() {
  const authStore = useAuthClientStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logout = async () => {
    handleClose();
    authStore.logout().then(() => navigate("/login"));
  };

  return (
    <div className="font-jaka h-screen bg-white w-64 px-3 py-4 flex flex-col border-r-1 border-r-secondary-grey">
      {/* Logo Section */}
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-bold text-primary-purple">BU Voice</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-purple/10 text-primary-purple"
                      : " text-secondary-black text-sm hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <Fragment>
          <button
            onClick={handleClickOpen}
            className="flex items-center gap-5 w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ProfilePicture imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />

            <span className="font-normal text-sm text-primary-black">
              Logout
            </span>
            <div className="flex-row flex-1" />
            <LucideLogOut className="w-6 h-6 text-red-600" />
          </button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Logout from BU Voice?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to logout from BU Voice?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                className="text-gray-400"
                onClick={handleClose}
                color="info"
              >
                Disagree
              </Button>
              <Button onClick={logout} color="error" autoFocus>
                Logout
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      </div>
    </div>
  );
}

export default SideBar;
