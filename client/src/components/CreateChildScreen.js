import React from 'react';
import Texts from '../Constants/Texts.js';
import withLanguage from './LanguageContext';
import moment from 'moment';
import axios from 'axios';

class CreateChildScreen extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.history.location.state !== undefined) {
			this.state = {
				...this.props.history.location.state
			}
		} else {
			this.state = {
				name: "",
				surname: "",
				gender: "unspecified",
				date: moment().date(),
				month: moment().month() + 1,
				year: moment().year(),
				acceptTerms: false,
				allergies: "",
				special_needs: "",
				other_info: "",
				acceptAdditionalTerms: false,
			};
		}
	}
	handleCancel = () => {
		this.props.history.goBack();
	}

	handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		if (name === "acceptTerms") {
			document.getElementById("acceptTermsCheckbox").checked = !this.state.acceptTerms;
			this.setState({ acceptTerms: !this.state.acceptTerms });
		}
		else {
			this.setState({ [name]: value });
		}

	}
	validate = () => {
		const formLength = this.formEl.length;
		if (this.formEl.checkValidity() === false) {
			for (let i = 0; i < formLength; i++) {
				const elem = this.formEl[i];
				const errorLabel = document.getElementById(elem.name + 'Err');
				if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
					if (!elem.validity.valid) {
						errorLabel.textContent = elem.validationMessage;
					} else {
						errorLabel.textContent = '';
					}
				}
			}
			return false;
		} else {
			for (let i = 0; i < formLength; i++) {
				const elem = this.formEl[i];
				const errorLabel = document.getElementById(elem.name + 'Err');
				if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
					errorLabel.textContent = '';
				}
			}
			return true;
		}
	}
	submitChanges = () => {
		const userId = this.props.match.params.profileId
		axios.post("/users/" + userId + "/children", {
			given_name: this.state.name,
			family_name: this.state.surname,
			birthdate: moment().set({
				year: this.state.year,
				month: this.state.month,
				date: this.state.date
			}),
			gender: this.state.gender,
			allergies: this.state.allergies,
			other_info: this.state.other_info,
			special_needs: this.state.special_needs
		})
			.then(response => {
				console.log(response);
				this.props.history.goBack();
			})
			.catch(error => {
				console.log(error);
				this.props.history.goBack();
			})
	}
	handleSave = (event) => {
		event.preventDefault();
		if (this.validate()) {
			this.submitChanges();
		}
		this.setState({ formIsValidated: true });
	}
	handleAdd = () => {
		const pathname = this.props.history.location.pathname;
		this.props.history.push({
			pathname: pathname + "/additional",
			state: {
				...this.state
			}
		});
		return false;
	}
	render() {
		const texts = Texts[this.props.language].createChildScreen;
		const formClass = [];
		const dates = [...Array(moment(`${this.state.year}-${this.state.month}`).daysInMonth()).keys()].map(x => ++x);
		const months = [...Array(12).keys()].map(x => ++x);
		const years = [...Array(18).keys()].map(x => x + (moment().year() - 17));
		if (this.state.formIsValidated) {
			formClass.push('was-validated');
		}
		return (
			<div>

				<div id="createChildProfileHeaderContainer" className="row no-gutters">
					<div className="col-2-10">
						<button className="transparentButton center" onClick={() => this.props.history.goBack()}>
							<i className="fas fa-times" />
						</button>
					</div>
					<div className="col-6-10">
						<h1 className="verticalCenter">{texts.backNavTitle}</h1>
					</div>
					<div className="col-2-10">
						<button className="transparentButton verticalCenter" onClick={this.handleSave}>
							<i className="fas fa-check" />
						</button>
					</div>

				</div>
				<div id="createChildProfileInfoContainer" className="horizontalCenter">
					<form ref={form => this.formEl = form} onSubmit={this.handleSubmit} className={formClass} noValidate>
						<div className="row no-gutters" style={{ minHeight: "7.6rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
							<div className="col-5-10">
								<input
									type="text" name="name" className="createChildProfileInputField center form-control" placeholder={texts.name}
									onChange={this.handleChange} required={true} value={this.state.name}
								/>
								<span style={{ marginTop: "4rem" }} className="invalid-feedback" id="nameErr"></span>
							</div>
							<div className="col-5-10">
								<input
									type="text" name="surname" className="createChildProfileInputField center form-control" placeholder={texts.surname}
									onChange={this.handleChange} required={true} value={this.state.surname}
								/>
								<span style={{ marginTop: "4rem" }} className="invalid-feedback" id="surnameErr"></span>
							</div>
						</div>
						<div className="row no-gutters" style={{ height: "7.6rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
							<div className="col-1-3">
								<div className="fullInput editChildProfileInputField center">
									<label htmlFor="date">{texts.date}</label>
									<select
										value={this.state.date}
										onChange={this.handleChange}
										name="date"
									>
										{
											dates.map(date =>
												<option key={date} value={date}>{date}</option>
											)
										}
									</select>
								</div>
							</div>
							<div className="col-1-3">
								<div className="fullInput editChildProfileInputField center">
									<label htmlFor="month">{texts.month}</label>
									<select
										value={this.state.month}
										onChange={this.handleChange}
										name="month"
									>
										{
											months.map(month =>
												<option key={month} value={month}>{month}</option>
											)
										}
									</select>
								</div>
							</div>
							<div className="col-1-3">
								<div className="fullInput editChildProfileInputField center">
									<label htmlFor="year">{texts.year}</label>
									<select
										value={this.state.year}
										onChange={this.handleChange}
										name="year"
									>
										{
											years.map(year =>
												<option key={year} value={year}>{year}</option>
											)
										}
									</select>
								</div>
							</div>
						</div>
						<div className="row no-gutters" style={{ height: "7.6rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
							<div className="col-10-10">
								<div className="fullInput editChildProfileInputField center">
									<label htmlFor="gender">{texts.gender}</label>
									<select
										value={this.state.gender}
										onChange={this.handleChange}
										name="gender"
									>
										<option value={'boy'}>{texts.boy}</option>
										<option value={'girl'}>{texts.girl}</option>
										<option value={'unspecified'}>{texts.unspecified}</option>
									</select>
								</div>
							</div>
						</div>
						<div id="additionalInformationContainer" className="row no-gutters" style={{ paddingBottom: "1rem", minHeight: "7.6rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
							<div className="col-7-10">
								<div className="center">
									<h1>{texts.additional}</h1>
									<h2>{texts.example}</h2>
								</div>
							</div>
							<div className="col-3-10">
								<button className="center" onClick={this.handleAdd}>
									{this.state.acceptAdditionalTerms ? texts.edit : texts.add}
								</button>
							</div>
						</div>
						<div className="acceptTermsContainer row no-gutters" style={{ minHeight: "7.6rem" }}>
							<div className="col-2-10">
								<input
									type="checkbox" name="acceptTerms" className="checkbox center "
									defaultChecked={this.state.acceptTerms} onChange={this.handleChange}
								/>
							</div>
							<div className="col-8-10">
								<h1 className="center">{texts.acceptTerms}</h1>
							</div>
						</div>
						<div style={{ paddingLeft: "3%" }} className="row no-gutters">
							<input
								type="checkbox" style={{ display: "none" }} id="acceptTermsCheckbox" name="acceptTerms" className="form-control" required={true}
								defaultChecked={this.state.acceptTerms}
							/>
							<span className="invalid-feedback" id="acceptTermsErr" ></span>
						</div>
					</form>
				</div>
			</div>
		);
	}
}


export default withLanguage(CreateChildScreen);