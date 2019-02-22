import React from "react";
import PropTypes from "prop-types";
import OptionsModal from "./OptionsModal";
import withLanguage from "./LanguageContext";
import { withRouter } from "react-router-dom";
import Texts from "../Constants/Texts.js";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

class ChildProfileHeader extends React.Component {
  state = { optionsModalIsOpen: false, confirmDialogIsOpen: false };
  handleClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };
  handleEdit = () => {
    const pathName = this.props.history.location.pathname;
    const newPath = pathName + "/edit";
    this.props.history.push(newPath);
  };
  handleOptions = () => {
    this.setState({ optionsModalIsOpen: true });
  };
  handleDelete = () => {
    const userId = this.props.match.params.profileId;
    const childId = this.props.match.params.childId;
    axios
      .delete("/users/" + userId + "/children/" + childId)
      .then(response => {
        console.log(response);
        this.props.history.goBack();
      })
      .catch(error => {
        console.log(error);
        this.props.history.goBack();
      });
  };
  handleConfirmDialogOpen = () => {
    this.setState({ optionsModalIsOpen: false, confirmDialogIsOpen: true });
  };
  handleConfirmDialogClose = choice => {
    if (choice === "agree") {
      this.handleDelete();
    }
    this.setState({ confirmDialogIsOpen: false });
  };
  render() {
    const texts = Texts[this.props.language].childProfileHeader;
    const options = [
      {
        label: texts.delete,
        style: "optionsModalButton",
        handle: this.handleConfirmDialogOpen
      }
    ];
    return (
      <React.Fragment>
        <ConfirmDialog
          title={texts.confirmDialogTitle}
          handleClose={this.handleConfirmDialogClose}
          isOpen={this.state.confirmDialogIsOpen}
        />
        <div
          id="profileHeaderContainer"
          style={{ background: this.props.background }}
        >
          <div className="row no-gutters" id="profileHeaderOptions">
            <button
              className="transparentButton"
              onClick={() => this.props.history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
            {this.props.match.params.profileId ===
            JSON.parse(localStorage.getItem("user")).id ? (
              <div id="profileOptionsContainer" className="verticalCenter">
                <button className="transparentButton" onClick={this.handleEdit}>
                  <i className="fas fa-pencil-alt" />
                </button>
                <button
                  className="transparentButton"
                  onClick={this.handleOptions}
                >
                  <i className="fas fa-ellipsis-v" />
                </button>
              </div>
            ) : (
              <div />
            )}
          </div>
          <img
            className="profilePhoto horizontalCenter"
            alt="child's profile"
            src={this.props.photo}
          />
          <h1 className="horizontalCenter">{this.props.name}</h1>
          <OptionsModal
            isOpen={this.state.optionsModalIsOpen}
            handleClose={this.handleClose}
            options={options}
          />
        </div>
      </React.Fragment>
    );
  }
}

ChildProfileHeader.propTypes = {
  background: PropTypes.string,
  name: PropTypes.string,
  photo: PropTypes.string,
  profileId: PropTypes.string
};

export default withRouter(withLanguage(ChildProfileHeader));
