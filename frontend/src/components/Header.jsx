import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice.js";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { id } = useSelector((state) => state.user.loggedInUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    if (!id) return;
    try {
      dispatch(logout(id));
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/auth");
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const windowClick = (e) => {
      const dataset = e.target.dataset.class;

      if (!dataset || dataset !== "add-setting") {
        setOpen(false);
      }
    };

    window.addEventListener("click", windowClick);

    return () => {
      window.removeEventListener("click", windowClick);
    };
  }, []);

  return (
    <Container $open={open}>
      <div id="wrapper">
        <p className="app-name">ShareMoo</p>

        {/* remove the component below if the user isnt authenticated */}
        <div
          className="toggle-img"
          data-class="add-setting"
          onClick={handleOpen}
        >
          <img src="/media/user.png" alt="" data-class="add-setting" />
          <img
            src="/media/down.png"
            alt=""
            className="up-down"
            data-class="add-setting"
          />
        </div>

        {open && (
          <div className="additional-setting" data-class="add-setting">
            <div className="setting" onClick={handleLogout}>
              <img
                src="/media/logout.png"
                alt="Logout"
                data-class="add-setting"
              />
              <span data-class="add-setting">Logout</span>
            </div>
            <div className="setting" data-class="add-setting">
              <img
                src="/media/settings.png"
                alt="Setting"
                data-class="add-setting"
              />
              <span data-class="add-setting">Setting</span>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  height: 10%;
  width: 100%;
  background: var(--gray);
  position: fixed;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  z-index: 2;

  & #wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1em;
    position: relative;

    & .additional-setting {
      position: absolute;
      right: 0;
      bottom: -110%;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 0.4em;
      background: var(--gray);
      padding: 1em;

      & .setting {
        display: flex;
        align-items: center;
        gap: 1em;
        margin: 1em 0;
        cursor: pointer;

        &:hover {
          & span {
            color: red;
          }
        }
      }
    }

    & .app-name {
      font-size: 1.5rem;
    }

    .toggle-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      & img {
        width: 30px;
      }

      & img:last-child {
        width: 20px;
      }

      & .up-down {
        transition: all 200ms;
        transform: ${(props) =>
          props.$open ? "rotate(180deg)" : "rotate(0deg)"};
      }
    }
  }
`;
