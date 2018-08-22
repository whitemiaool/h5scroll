import React, { Component } from 'react';
import './os.css';
import loading from './loading.gif'

let api = {};
class App extends Component {
    constructor() {
        super();
        this.state = {
            msglist: [],
            inputMsgContent: '',
            wtf: false,
            loadingTop: 0,
            transition:false
        }
        this.scrollTimmerStack = [];
        this.firstTouchYvalue = -1;

        this.nextItemCount = 0;
        this.prevItemCount = 0;
        // loading loading ...
        this.onRenderLoading = false
        // loading has render
        this.hasRenderLoading = false
        // prev scrollHeight
        this.preTop = 0;

        // loading height(px)
        this.LOADING_HEIGHT = 35;
    }
    scrollToPx = (ele, px, ms = 1) => {
        this.clearAllScrollTimer();
        if(ele.scrollHeight<=ele.clientHeight) return
        let currentScrollHeight = ele.scrollTop;
        let needScrollPx = px - currentScrollHeight - ele.clientHeight;
        let scrollTimes = Math.ceil(ms / 20);
        let steps = needScrollPx / scrollTimes;
        for (let i = 1; i <= scrollTimes; i++) {
            let timmeruuid = this.guid();
            timmeruuid = setTimeout(() => {
                ele.scrollTo(0, currentScrollHeight + i * steps)
            }, i * 20)
            this.scrollTimmerStack.push(timmeruuid)
        }
    }
    scrollToBottom =(ms=100)=>{
        setTimeout(()=>{
            this.scrollToPx(this.scrollWrap,this.scrollWrap.scrollHeight,ms)
        },20)
    }
    clearAllScrollTimer = () => {
        this.scrollTimmerStack.map((t) => {
            window.clearTimeout(t)
        })
        this.scrollTimmerStack = [];
    }
    guid = () => {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    getScrollAreaData = (ele) => {
        return {
            sTop: ele.scrollTop,
            cHeight: ele.clientHeight,
            sHeight: ele.scrollHeight
        }
    }
    handleTouchEnd = () => {
        this.firstTouchYvalue = -1;
        window.clearTimeout(this.hideLoadingTimer)
        let {loadingTop } = this.state;
        if (this.onRenderLoading && loadingTop >= this.LOADING_HEIGHT) {
            !this.hasRenderLoading&&this.props.loadcb&&this.props.loadcb()
            this.setState({
                loadingTop: this.LOADING_HEIGHT,
            })
            this.hasRenderLoading = true;
        } else if (this.onRenderLoading && loadingTop < this.LOADING_HEIGHT) {
            this.hideLoading()
        }
        this.hideLoadingTimer = window.setTimeout(() => {
            this.hideLoading()
        }, 10000)
    }

    hideLoading = (flag)=>{
        this.onRenderLoading = false
        this.hasRenderLoading = false;
        this.setState({
            loadingTop: 0,
            transition:!!flag
        })
    }

    handleTouchStart = (e) => {
        this.shouldRenderLoading(e)&&this.hideLoading()
        window.clearTimeout(this.hideLoadingTimer)
        if (this.firstTouchYvalue === -1) {
            this.firstTouchYvalue = e.targetTouches[0].clientY
        }
    }

    handleTouchMove = (e) => {
        let { loadingTop } = this.state;

        if (this.shouldRenderLoading(e)) {
            this.onRenderLoading = true;
        }
        if (this.onRenderLoading && this.touchUpOrDown(e)) {
            loadingTop = loadingTop >= this.LOADING_HEIGHT ? (this.hasRenderLoading?this.LOADING_HEIGHT:0) : 0;
            this.setState({
                loadingTop: (loadingTop + e.targetTouches[0].clientY - this.firstTouchYvalue) > 60 ? 60 : (loadingTop + e.targetTouches[0].clientY - this.firstTouchYvalue)
            })
        }
    }
    shouldRenderLoading = (e) => {
        let { sTop } = this.getScrollAreaData(this.scrollWrap);
        return (sTop === 0) && !this.onRenderLoading && !!this.touchUpOrDown(e)
    }

    // down:true
    touchUpOrDown = (e) => {
        return e.targetTouches[0].clientY - this.firstTouchYvalue > 0
    }

    componentWillUpdate(nextP) {
        let {children} = nextP;
        if (children) {
            let c = this.scrollWrap;
            let sH = c.scrollHeight < c.clientHeight ? c.clientHeight : c.scrollHeight;
            this.prevScrollHeight = sH;
            this.nextItemCount =React.Children.count(children);
            this.preTop = c.scrollTop
        }
    }

    componentDidUpdate() {
        let c = this.scrollWrap;
        let sH = c.scrollHeight < c.clientHeight ? c.clientHeight : c.scrollHeight;
        if (this.nextItemCount > this.prevItemCount) {
            window.clearTimeout(this.hideLoadingTimer)
            this.prevItemCount = this.nextItemCount;
            this.nextScrollHeight = sH;
            const offsetScrollHeight = this.nextScrollHeight - this.prevScrollHeight;
            this.scrollWrap.scrollTo(0, offsetScrollHeight + this.preTop-this.LOADING_HEIGHT)
            this.hideLoading(true);
        }

    }
    componentDidMount() {
        api.scrollToBottom = this.scrollToBottom
    }
    render() {
        let { loadingTop,transition} = this.state;
        let contentStyle = {
            transform: `translateY(${loadingTop || 0}px)`,
            transition: transition?'':`all 0.5s`
        };
        return (
            <div
                onTouchMove={this.handleTouchMove}
                onWheel={this.clearAllScrollTimer}
                className="c-wrap"
                onTouchEnd={this.handleTouchEnd}
                onTouchStart={this.handleTouchStart}
                ref={(ref) => { this.scrollWrap = ref }}>
                <div className="c-c" style={contentStyle}>
                    {<div className="c-load"><img style={{ height: '30px' }} src={loading} alt="" /></div>}
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export {App as default,api};
