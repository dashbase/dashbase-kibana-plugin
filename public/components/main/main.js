import React from "react";
import {
    EuiPage,
    EuiPageHeader,
    EuiTitle,
    EuiPageBody,
    EuiPageContent,
    EuiPageContentHeader,
    EuiPageContentBody,
    EuiText,
    EuiButton
} from "@elastic/eui";
import {parse} from 'url';
import chrome from 'ui/chrome';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            url: ""
        };
    }

    componentDidMount() {
        const {httpClient} = this.props;
        httpClient.get(chrome.addBasePath(`/auth/url`)).then((resp) => {
            console.log(resp)
            this.setState({
                url: resp.data.url,
                loading: false
            });
        });
    }

    renderUrls() {
        if (this.state.loading){
            return ( <EuiPageContentBody> Loading...</EuiPageContentBody>)
        }
        if (!(this.state.url)){
            return ( <EuiPageContentBody> Get Auth Url Failed, please set ENV: DASHBASE_AUTH_URL </EuiPageContentBody>)
        }

        const {callback} = this.props;
        const u = new URL(window.location.href);
        const nextUrl = u.searchParams.get("nextUrl");
        const params = `?redirect_uri=` + encodeURIComponent(window.location.host + `${callback}?nextUrl=${nextUrl}`)


        let urls = [];
        urls.push(<EuiButton
            size="s"
            onClick={() => window.location.href = this.state.url + params}
        >
           Go To Dashbase Auth Server
        </EuiButton>)

        return <EuiPageContentBody>{urls}</EuiPageContentBody>;

    }


    render() {
        return (
            <EuiPage>
                <EuiPageHeader>
                    <EuiTitle size="l">
                        <h1>Dashbase Login</h1>
                    </EuiTitle>
                </EuiPageHeader>
                <EuiPageBody>
                    <EuiPageContent>
                        <EuiPageContentHeader>
                            <EuiTitle>
                                <h2>Choose Dashbase Auth</h2>
                            </EuiTitle>
                        </EuiPageContentHeader>
                        {this.renderUrls()}
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        );
    }

};
