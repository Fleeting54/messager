import React, {Component} from 'react';
import Message from './Message';
import MessageBoard from './MessageBoard';
import ErrorPopup from './ErrorPopup';
import JoinInput from './JoinInput';
import MessageInput from './MessageInput';

import MessageServer from '../classes/MessageServer';

export default class Messager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            joinedIn: false,
            isError: false,
            isLoading: false,
            messages: []
        };
        this._joinServer = this._joinServer.bind(this);
        this._sendMessage = this._sendMessage.bind(this);
        this._handleJoin = this._handleJoin.bind(this);
        this._handleJoinFail = this._handleJoinFail.bind(this);
        this._handleError = this._handleError.bind(this);
        this._handleMessages = this._handleMessages.bind(this);
        this._handleNewMessage = this._handleNewMessage.bind(this);
    }
    _handleJoin() {
        let user = this._user;
        this.setState({joinedIn: true, user: user, isError: false});
        this._server.getMessages();
    }
    _handleJoinFail(error) {
        this.setState({isError: true, errorMessage: error.message});
    }
    _handleError(error) {
        this.setState({isError: true, errorMessage: error.message});
    }
    _handleMessages(board) {
        this.setState({messages: board});
    }
    _handleNewMessage(message) {
        let messages = this.state.messages;
        messages.push(message);
        this.setState({messages: messages});
    }
    _joinServer(user) {
        this._user = user;
        this._server.join(user);
    }
    _sendMessage(message) {
        this._server.sendMessage(message);
    }
    _handlePong() {
        console.log('ponged');
    }
    componentWillMount() {
        let server = this._server = new MessageServer(this.props.url);
        server.onOpen = () => {
            server.ping();
            server.onPong = this._handlePong;
            server.onJoin = this._handleJoin;
            server.onJoinFail = this._handleJoinFail;
            server.onMessages = this._handleMessages;
            server.onNewMessage = this._handleNewMessage;
        }
    }
    render() {
        return (
            <div>
                <MessageBoard me={this.state.user} messages={this.state.messages} />
                <ErrorPopup show={this.state.isError} message={this.state.errorMessage} />
                <MessageInput enabled={this.state.joinedIn} user={this.state.user} onSend={this._sendMessage} />
                <JoinInput joined={this.state.joinedIn} onJoin={this._joinServer} onError={this._handleError} />
            </div>
        );
    }
}