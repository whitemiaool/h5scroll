'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.api = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./os.css');

var _loading = require('./loading.gif');

var _loading2 = _interopRequireDefault(_loading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var api = {};

var App = function (_Component) {
    _inherits(App, _Component);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        _this.scrollToPx = function (ele, px) {
            var ms = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            _this.clearAllScrollTimer();
            if (ele.scrollHeight <= ele.clientHeight) return;
            var currentScrollHeight = ele.scrollTop;
            var needScrollPx = px - currentScrollHeight - ele.clientHeight;
            var scrollTimes = Math.ceil(ms / 20);
            var steps = needScrollPx / scrollTimes;

            var _loop = function _loop(i) {
                var timmeruuid = _this.guid();
                timmeruuid = setTimeout(function () {
                    ele.scrollTo(0, currentScrollHeight + i * steps);
                }, i * 20);
                _this.scrollTimmerStack.push(timmeruuid);
            };

            for (var i = 1; i <= scrollTimes; i++) {
                _loop(i);
            }
        };

        _this.scrollToBottom = function () {
            var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

            setTimeout(function () {
                _this.scrollToPx(_this.scrollWrap, _this.scrollWrap.scrollHeight, ms);
            }, 20);
        };

        _this.clearAllScrollTimer = function () {
            _this.scrollTimmerStack.map(function (t) {
                window.clearTimeout(t);
            });
            _this.scrollTimmerStack = [];
        };

        _this.guid = function () {
            function S4() {
                return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
            }
            return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
        };

        _this.getScrollAreaData = function (ele) {
            return {
                sTop: ele.scrollTop,
                cHeight: ele.clientHeight,
                sHeight: ele.scrollHeight
            };
        };

        _this.handleTouchEnd = function () {
            _this.firstTouchYvalue = -1;
            window.clearTimeout(_this.hideLoadingTimer);
            var loadingTop = _this.state.loadingTop;

            if (_this.onRenderLoading && loadingTop >= _this.LOADING_HEIGHT) {
                !_this.hasRenderLoading && _this.props.loadcb && _this.props.loadcb();
                _this.setState({
                    loadingTop: _this.LOADING_HEIGHT
                });
                _this.hasRenderLoading = true;
            } else if (_this.onRenderLoading && loadingTop < _this.LOADING_HEIGHT) {
                _this.hideLoading();
            }
            _this.hideLoadingTimer = window.setTimeout(function () {
                _this.hideLoading();
            }, 10000);
        };

        _this.hideLoading = function (flag) {
            _this.onRenderLoading = false;
            _this.hasRenderLoading = false;
            _this.setState({
                loadingTop: 0,
                transition: !!flag
            });
        };

        _this.handleTouchStart = function (e) {
            _this.shouldRenderLoading(e) && _this.hideLoading();
            window.clearTimeout(_this.hideLoadingTimer);
            if (_this.firstTouchYvalue === -1) {
                _this.firstTouchYvalue = e.targetTouches[0].clientY;
            }
        };

        _this.handleTouchMove = function (e) {
            var loadingTop = _this.state.loadingTop;


            if (_this.shouldRenderLoading(e)) {
                _this.onRenderLoading = true;
            }
            if (_this.onRenderLoading && _this.touchUpOrDown(e)) {
                loadingTop = loadingTop >= _this.LOADING_HEIGHT ? _this.hasRenderLoading ? _this.LOADING_HEIGHT : 0 : 0;
                _this.setState({
                    loadingTop: loadingTop + e.targetTouches[0].clientY - _this.firstTouchYvalue > 60 ? 60 : loadingTop + e.targetTouches[0].clientY - _this.firstTouchYvalue
                });
            }
        };

        _this.shouldRenderLoading = function (e) {
            var _this$getScrollAreaDa = _this.getScrollAreaData(_this.scrollWrap),
                sTop = _this$getScrollAreaDa.sTop;

            return sTop === 0 && !_this.onRenderLoading && !!_this.touchUpOrDown(e);
        };

        _this.touchUpOrDown = function (e) {
            return e.targetTouches[0].clientY - _this.firstTouchYvalue > 0;
        };

        _this.state = {
            msglist: [],
            inputMsgContent: '',
            wtf: false,
            loadingTop: 0,
            transition: false
        };
        _this.scrollTimmerStack = [];
        _this.firstTouchYvalue = -1;

        _this.nextItemCount = 0;
        _this.prevItemCount = 0;
        // loading loading ...
        _this.onRenderLoading = false;
        // loading has render
        _this.hasRenderLoading = false;
        // prev scrollHeight
        _this.preTop = 0;

        // loading height(px)
        _this.LOADING_HEIGHT = 35;
        return _this;
    }

    // down:true


    _createClass(App, [{
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextP) {
            var children = nextP.children;

            if (children) {
                var c = this.scrollWrap;
                var sH = c.scrollHeight < c.clientHeight ? c.clientHeight : c.scrollHeight;
                this.prevScrollHeight = sH;
                this.nextItemCount = _react2.default.Children.count(children);
                this.preTop = c.scrollTop;
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var c = this.scrollWrap;
            var sH = c.scrollHeight < c.clientHeight ? c.clientHeight : c.scrollHeight;
            if (this.nextItemCount > this.prevItemCount) {
                window.clearTimeout(this.hideLoadingTimer);
                this.prevItemCount = this.nextItemCount;
                this.nextScrollHeight = sH;
                var offsetScrollHeight = this.nextScrollHeight - this.prevScrollHeight;
                this.scrollWrap.scrollTo(0, offsetScrollHeight + this.preTop - this.LOADING_HEIGHT);
                this.hideLoading(true);
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            api.scrollToBottom = this.scrollToBottom;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                loadingTop = _state.loadingTop,
                transition = _state.transition;

            var contentStyle = {
                transform: 'translateY(' + (loadingTop || 0) + 'px)',
                transition: transition ? '' : 'all 0.5s'
            };
            return _react2.default.createElement(
                'div',
                {
                    onTouchMove: this.handleTouchMove,
                    onWheel: this.clearAllScrollTimer,
                    className: 'c-wrap',
                    onTouchEnd: this.handleTouchEnd,
                    onTouchStart: this.handleTouchStart,
                    ref: function ref(_ref) {
                        _this2.scrollWrap = _ref;
                    } },
                _react2.default.createElement(
                    'div',
                    { className: 'c-c', style: contentStyle },
                    _react2.default.createElement(
                        'div',
                        { className: 'c-load' },
                        _react2.default.createElement('img', { style: { height: '30px' }, src: _loading2.default, alt: '' })
                    ),
                    this.props.children
                )
            );
        }
    }]);

    return App;
}(_react.Component);

exports.default = App;
exports.api = api;