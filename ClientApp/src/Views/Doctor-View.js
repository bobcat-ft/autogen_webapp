"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorView = void 0;
var React = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var OpenSpeechDataStore = __importStar(require("../Store/OpenSpeechToolsData"));
var react_bootstrap_1 = require("react-bootstrap");
var NotificationWrapper_jsx_1 = __importDefault(require("../Components/Notifications/NotificationWrapper.jsx"));
var FileUploaderPresentationalComponent_1 = require("../Components/FileManagement/FileUploaderPresentationalComponent");
var ControlPanel_1 = require("./FunctionalElements/ControlPanel");
var signalR = __importStar(require("@microsoft/signalr"));
var connection = new signalR.HubConnectionBuilder().withUrl("/doctor-patient").build();
var DoctorView = /** @class */ (function (_super) {
    __extends(DoctorView, _super);
    function DoctorView(props) {
        var _this = _super.call(this, props) || this;
        _this.fileUploaderInput = null;
        _this.dragEventCounter = 0;
        _this.dragenterListener = function (event) {
            _this.overrideEventDefaults(event);
            _this.dragEventCounter++;
            if (event.dataTransfer.items && event.dataTransfer.items[0]) {
                _this.setState({ dragging: true });
            }
            else if (event.dataTransfer.types &&
                event.dataTransfer.types[0] === "Files") {
                // This block handles support for IE - if you're not worried about
                // that, you can omit this
                _this.setState({ dragging: true });
            }
        };
        _this.dragleaveListener = function (event) {
            _this.overrideEventDefaults(event);
            _this.dragEventCounter--;
            if (_this.dragEventCounter === 0) {
                _this.setState({ dragging: false });
            }
        };
        _this.dropListener = function (event) {
            _this.overrideEventDefaults(event);
            _this.dragEventCounter = 0;
            _this.setState({ dragging: false });
            if (event.dataTransfer.files && event.dataTransfer.files[0]) {
                _this.setState({ file: event.dataTransfer.files[0], newFile: true });
                _this.handleNewPatientConfigFile(event.dataTransfer.files[0]);
            }
        };
        _this.overrideEventDefaults = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        _this.onSelectFileClick = function () {
            _this.fileUploaderInput && _this.fileUploaderInput.click();
        };
        _this.onFileChanged = function (event) {
            if (event.target.files && event.target.files[0]) {
                _this.setState({ file: event.target.files[0], newFile: true });
                _this.handleNewPatientConfigFile(event.target.files[0]);
            }
        };
        _this.handleDownloadDemosJSON = function () {
            _this.handleRequestGetRegisterConfig(_this.downloadPatientConfig);
        };
        _this.state = {
            uiConfigName: "",
            dragging: false,
            file: null,
            newFile: false,
            connectedToServer: false,
            sessionStarted: false,
            sessionPatientConnected: false,
            groupID: "",
            user: "Doctor",
            message: "",
            patientFirstName: "",
            patientLastName: "",
            patientFeedback: -2,
            patientFeedbackNotes: "",
            doctorNotes: "",
            notificationText: "",
            notificationLevel: ""
        };
        _this.handleNotesChange = _this.handleNotesChange.bind(_this);
        _this.setNotificationText = _this.setNotificationText.bind(_this);
        _this.setNotificationLevel = _this.setNotificationLevel.bind(_this);
        _this.startSession = _this.startSession.bind(_this);
        _this.verifyConnection = _this.verifyConnection.bind(_this);
        _this.startGroup = _this.startGroup.bind(_this);
        _this.stopGroup = _this.stopGroup.bind(_this);
        _this.sendFeedbackRequestToServer = _this.sendFeedbackRequestToServer.bind(_this);
        _this.handleRequestGetRegisterConfig = _this.handleRequestGetRegisterConfig.bind(_this);
        _this.handleRequestSetRegisterConfig = _this.handleRequestSetRegisterConfig.bind(_this);
        _this.handlePatientFirstNameChange = _this.handlePatientFirstNameChange.bind(_this);
        _this.handlePatientLastNameChange = _this.handlePatientLastNameChange.bind(_this);
        _this.handleDownloadDemosJSON = _this.handleDownloadDemosJSON.bind(_this);
        _this.downloadPatientConfig = _this.downloadPatientConfig.bind(_this);
        _this.handleNewPatientConfigFile = _this.handleNewPatientConfigFile.bind(_this);
        _this.doNothing = _this.doNothing.bind(_this);
        return _this;
    } //End Constructor 
    DoctorView.prototype.componentDidMount = function () {
        var _this = this;
        this.startSession();
        window.addEventListener("dragover", function (event) {
            _this.overrideEventDefaults(event);
        });
        window.addEventListener("drop", function (event) {
            _this.overrideEventDefaults(event);
        });
    }; // End ComponentDidMount
    DoctorView.prototype.componentDidUpdate = function () {
        if (this.props.autogen) {
            if (this.props.autogen.name === 'Demo Upload Failed' && this.props.autogen.name != this.state.uiConfigName) {
                this.setNotificationLevel('error');
                this.setNotificationText('Demo Upload Failed');
                this.setState({ uiConfigName: this.props.autogen.name });
            }
            else if (this.props.autogen.name === "ERROR" && this.props.autogen.name != this.state.uiConfigName) {
                this.setNotificationLevel('error');
                this.setNotificationText('Control Generation Failed');
                this.setState({ uiConfigName: this.props.autogen.name });
            }
            else if (this.props.autogen.name != this.state.uiConfigName) {
                this.setNotificationLevel('success');
                this.setNotificationText('New Controls Generated: ' + this.props.autogen.name);
                this.setState({ uiConfigName: this.props.autogen.name });
            }
        }
    }; //End ComponentDidUpdate
    DoctorView.prototype.componentWillMount = function () {
        window.removeEventListener("dragover", this.overrideEventDefaults);
        window.removeEventListener("drop", this.overrideEventDefaults);
    };
    DoctorView.prototype.handleNotesChange = function (e) {
        if (!this.state.newFile) {
            this.setState({ doctorNotes: e.target.value });
        }
    };
    DoctorView.prototype.handlePatientFirstNameChange = function (e) {
        this.setState({ patientFirstName: e.target.value });
    };
    DoctorView.prototype.handlePatientLastNameChange = function (e) {
        this.setState({ patientLastName: e.target.value });
    };
    DoctorView.prototype.handleRequestGetRegisterConfig = function (callback) {
        this.props.requestAutogenConfiguration(this.props.deviceAddress);
    };
    DoctorView.prototype.handleRequestSetRegisterConfig = function (configuration) {
        var output = [];
        var packet;
        for (var i = 0; i < configuration.length; i++) {
            packet = {
                index: i,
                value: configuration[i].value
            };
            output.push(packet);
        }
        this.props.requestSendModelData(output, this.props.deviceAddress);
    };
    DoctorView.prototype.handleNewPatientConfigFile = function (configFile) {
        var _this = this;
        if (configFile) {
            var text;
            text = "";
            var reader = new FileReader();
            reader.readAsBinaryString(configFile);
            reader.onloadend = (function () {
                text = reader.result;
                var obj = JSON.parse(text);
                var config = {
                    patientFeedback: obj.patientFeedback,
                    patientFeedbackNotes: obj.patientFeedbackNotes,
                    doctorNotes: obj.doctorNotes,
                    patientFirstName: obj.patientFirstName,
                    patientLastName: obj.patientLastName,
                    configuration: obj.registerConfiguration,
                };
                _this.setState({
                    patientFeedback: config.patientFeedback,
                    patientFeedbackNotes: config.patientFeedbackNotes,
                    doctorNotes: config.doctorNotes,
                    patientFirstName: config.patientFirstName,
                    patientLastName: config.patientLastName,
                    newFile: false
                });
                _this.handleRequestSetRegisterConfig(config.configuration);
            });
        }
    };
    DoctorView.prototype.downloadPatientConfig = function () {
        var config = {
            patientFeedback: this.state.patientFeedback,
            patientFeedbackNotes: this.state.patientFeedbackNotes,
            doctorNotes: this.state.doctorNotes,
            patientFirstName: this.state.patientFirstName,
            patientLastName: this.state.patientLastName,
            configuration: null
        };
        if (this.props.autogen) {
            config.configuration = this.props.autogen.data;
        }
        downloadObjectAsJson(config, "patient_config");
    };
    DoctorView.prototype.setNotificationText = function (text) {
        this.setState({ notificationText: text });
    };
    DoctorView.prototype.setNotificationLevel = function (level) {
        this.setState({ notificationLevel: level });
    };
    DoctorView.prototype.verifyConnection = function () {
        connection.invoke("AfterConnected").catch(function (err) {
            return console.error(err.toString());
        });
    };
    DoctorView.prototype.startSession = function () {
        var _this = this;
        connection.on("Connected", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            _this.setState({
                connectedToServer: true,
                notificationLevel: "success",
                notificationText: msg
            });
        });
        connection.on("ReceiveMessage", function (user, message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var encodedMsg = user + ": " + msg;
            _this.setState({ message: encodedMsg });
        });
        connection.on("GroupMessage", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var encodedMsg = msg;
            _this.setState({
                notificationLevel: "info",
                notificationText: msg
            });
        });
        connection.on("AddedToGroup", function (message) {
            _this.setState({
                sessionStarted: true,
                notificationLevel: "info",
                notificationText: message
            });
        });
        connection.on("RequestToJoin", function (message) {
            connection.invoke("AcceptRequestToJoinGroup", _this.state.groupID, message).catch(function (err) {
                return console.error(err.toString());
            });
        });
        connection.on("LeftGroup", function (message) {
            _this.setState({
                sessionStarted: false,
                notificationLevel: "info",
                notificationText: message
            });
        });
        connection.on("UserDisconnected", function (user) {
            var msg = "User " + user + " has disconnected";
            _this.setState({
                notificationLevel: "warning",
                notificationText: msg
            });
        });
        connection.on("ReceiveFeedback", function (user, feedback, notes) {
            _this.setState({ message: feedback });
            var feedbackLevel = "";
            var feedbackText = "";
            if (feedback === 1) {
                feedbackLevel = "success";
                feedbackText = "Good";
            }
            else if (feedback === -1) {
                feedbackLevel = "error";
                feedbackText = "Bad";
            }
            else {
                feedbackLevel = "warning";
                feedbackText = "Neutral";
            }
            var d = new Date();
            var n = d.toLocaleTimeString();
            feedbackText = user + " Feedback: " + feedbackText + " at " + n;
            _this.setState({
                notificationLevel: feedbackLevel,
                notificationText: feedbackText,
                patientFeedback: feedback,
                patientFeedbackNotes: notes
            });
        });
        connection.on("GroupEnded", function (message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            _this.setState({
                sessionStarted: false,
                sessionPatientConnected: false,
                groupID: "Inactive"
            });
        });
        connection.start()
            .then(function (val) {
        }).then(function (res) { return _this.verifyConnection(); })
            .catch(function (err) {
            setTimeout(function () { return connection.start(); }, 5000);
            return console.error(err.toString());
        });
    }; //End Start Connection to SignalR Client hub
    DoctorView.prototype.startGroup = function () {
        var nums = "0123456789";
        var result = "";
        for (var i = 4; i > 0; --i) {
            result += nums[Math.round(Math.random() * (nums.length - 1))];
        }
        this.setState({ groupID: result });
        connection.invoke("AddToGroup", result).catch(function (err) {
            return console.error(err.toString());
        });
    };
    DoctorView.prototype.stopGroup = function () {
        connection.invoke("EndGroup", this.state.groupID).catch(function (err) {
            return console.error(err.toString());
        });
        this.setState({ sessionStarted: false, groupID: "" });
    };
    DoctorView.prototype.sendFeedbackRequestToServer = function () {
        connection.invoke("RequestFeedback", this.state.user, this.state.groupID).catch(function (err) {
            return console.error(err.toString());
        });
    };
    DoctorView.prototype.doNothing = function () {
    };
    DoctorView.prototype.render = function () {
        function disableIfNotChosen(choice, itemNumber) {
            if (choice === itemNumber) {
                return false;
            }
            else {
                return true;
            }
        }
        function feedbackUI(props, state) {
            return (<react_bootstrap_1.Modal.Dialog className="">
          <react_bootstrap_1.Modal.Header>
            <react_bootstrap_1.Modal.Title>Patient Feedback</react_bootstrap_1.Modal.Title>
            <div className="flex-right">
              <react_bootstrap_1.Button onClick={props.sendFeedbackRequestToServer} className="btn-simple btn-icon">
                <i className="fa fa-pencil-square-o large-icon"/>
              </react_bootstrap_1.Button>
              <react_bootstrap_1.Button variant="primary" className="float-right btn-simple btn-icon" onClick={props.handleDownloadDemosJSON}>
                <i className="fa fa-save large-icon"/>
              </react_bootstrap_1.Button>
              <FileUploaderPresentationalComponent_1.FileUploaderPresentationalComponent dragging={props.state.dragging} file={props.state.file} onSelectFileClick={props.onSelectFileClick} onDrag={props.overrideEventDefaults} onDragStart={props.overrideEventDefaults} onDragEnd={props.overrideEventDefaults} onDragOver={props.overrideEventDefaults} onDragEnter={props.dragenterListener} onDragLeave={props.dragleaveListener} onDrop={props.dropListener}>
                <input ref={function (el) { return (props.fileUploaderInput = el); }} type="file" className="file-uploader-hidden file-uploader__input" onChange={props.onFileChanged}/>
              </FileUploaderPresentationalComponent_1.FileUploaderPresentationalComponent>
            </div></react_bootstrap_1.Modal.Header>
          <react_bootstrap_1.Form className="display-em">
            <react_bootstrap_1.FormControl className="patient-first-name" placeholder="First name" value={state.patientFirstName} onChange={props.handlePatientFirstNameChange}/>
            <react_bootstrap_1.FormControl className="patient-last-name" placeholder="Last name" value={state.patientLastName} onChange={props.handlePatientLastNameChange}/>
          </react_bootstrap_1.Form>
          <div className="patient-feedback-interface">
            <react_bootstrap_1.Button variant="light" disabled={disableIfNotChosen(state.patientFeedback, 1)} className="btn-simple btn-icon btn-success">
              <i className="fa fa-smile-o large-icon"/>
            </react_bootstrap_1.Button>
            <react_bootstrap_1.Button variant="light" disabled={disableIfNotChosen(state.patientFeedback, 0)} className="btn-simple btn-icon btn-warning">
              <i className="far fa-meh large-icon"/>
            </react_bootstrap_1.Button>
            <react_bootstrap_1.Button variant="light" disabled={disableIfNotChosen(state.patientFeedback, -1)} className="btn-simple btn-icon btn-danger">
              <i className="far fa-frown large-icon"/>
            </react_bootstrap_1.Button>
          </div>
          <div>
            <react_bootstrap_1.InputGroup>
              <react_bootstrap_1.InputGroup.Prepend>
                <react_bootstrap_1.InputGroup.Text>Patient Notes</react_bootstrap_1.InputGroup.Text>
              </react_bootstrap_1.InputGroup.Prepend>
              <react_bootstrap_1.FormControl value={state.patientFeedbackNotes} disabled as="textarea" aria-label="With textarea"/>
            </react_bootstrap_1.InputGroup>
            <react_bootstrap_1.InputGroup>
              <react_bootstrap_1.InputGroup.Prepend>
                <react_bootstrap_1.InputGroup.Text>Doctor Notes</react_bootstrap_1.InputGroup.Text>
              </react_bootstrap_1.InputGroup.Prepend>
              <react_bootstrap_1.FormControl value={state.doctorNotes} onChange={props.handleNotesChange} as="textarea" aria-label="With textarea"/>
            </react_bootstrap_1.InputGroup>
          </div>

        </react_bootstrap_1.Modal.Dialog>);
        }
        function isSessionActive(state) {
            var sessionClassName = "doctor-session ";
            if (state.sessionStarted) {
                sessionClassName += ("session-active");
            }
            else {
                sessionClassName += ("session-inactive");
            }
            return sessionClassName;
        }
        function getSessionButton(props, state) {
            if (state.sessionStarted && state.connectedToServer) {
                return (<react_bootstrap_1.Button className="flex-right btn-simple btn-icon" onClick={props.stopGroup}><i className="fa fa-stop large-icon"/>
          </react_bootstrap_1.Button>);
            }
            else if (!state.sessionStarted && state.connectedToServer) {
                return (<react_bootstrap_1.Button className="flex-right btn-simple btn-icon" onClick={props.startGroup}><i className="fa fa-play large-icon"/>
          </react_bootstrap_1.Button>);
            }
            else {
                return (<react_bootstrap_1.Button className="flex-right btn-simple btn-icon">
            <react_bootstrap_1.Spinner animation="border" variant="primary"/>
          </react_bootstrap_1.Button>);
            }
        }
        return (<div className="content">
        <NotificationWrapper_jsx_1.default pushText={this.state.notificationText} level={this.state.notificationLevel}/>
        <react_bootstrap_1.Container fluid>
          <react_bootstrap_1.Row>
            <react_bootstrap_1.Modal.Dialog>
              <react_bootstrap_1.Modal.Header className={isSessionActive(this.state)}>
                <react_bootstrap_1.Modal.Title className="float-left">
                  Session
                </react_bootstrap_1.Modal.Title>
                {getSessionButton(this, this.state)}
              </react_bootstrap_1.Modal.Header>
              <react_bootstrap_1.Row>
                <h4 className="centered-header">{this.state.groupID}</h4>
              </react_bootstrap_1.Row>
            </react_bootstrap_1.Modal.Dialog>
          </react_bootstrap_1.Row>
          <react_bootstrap_1.Row>{feedbackUI(this, this.state)}</react_bootstrap_1.Row>
          <ControlPanel_1.ControlPanel {...this.props}/>
          <script src="~/js/signalr/dist/browser/signalr.js"></script>
          <script src="~/js/chat.js"></script>
        </react_bootstrap_1.Container>
      </div>);
    }; //End Render
    DoctorView.counter = 0;
    return DoctorView;
}(React.PureComponent));
exports.DoctorView = DoctorView;
function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 4));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
exports.default = react_redux_1.connect(function (state) { return state.openSpeechData; }, OpenSpeechDataStore.openSpeechDataActionCreators)(DoctorView);
