import { graphql } from 'gatsby'
import * as React from 'react'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import SocialLinks from '../components/SocialLinks'
import { Jumbotron } from '../components/Jumbotron'
import { GetSourcegraphNowActions } from '../css/components/actions/GetSourcegraphNowActions'
import { ContentPage } from '../components/content/ContentPage'
import { ContentSection } from '../components/content/ContentSection'
import { getHTMLParts, subscriptionLinks } from '../pages/podcast'

interface Option {
    name: string
    hash: string
    html?: string
}

export default class PodcastEpisodeTemplate extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    public componentDidMount(): void {
        if (document) {
            document.getElementsByTagName('body')[0].setAttribute('style', 'background-image:none')
        }
    }

    public render(): JSX.Element | null {
        const md = this.props.data.markdownRemark
        const title = md.frontmatter.title
        const publishDate = md.frontmatter.publishDate
        let slug = md.frontmatter.slug
        const description = md.frontmatter.description ? md.frontmatter.description : md.excerpt
        const content = md.html
        const image = md.frontmatter.heroImage
            ? `${md.frontmatter.heroImage}`
            : 'https://about.sourcegraph.com/sourcegraph-mark.png'
        const meta = {
            title,
            image,
            description,
        }

        const { guestsHTML, audioHTML, summaryHTML, transcriptHTML, showNotesHTML } = getHTMLParts(content)
        const options: Option[] = [
            {
                name: 'Summary',
                hash: 'summary',
                html: summaryHTML,
            },
            {
                name: 'Show&nbsp;notes',
                hash: 'showNotes',
                html: showNotesHTML,
            },
            {
                name: 'Transcript',
                hash: 'transcript',
                html: transcriptHTML,
            },
        ].filter(option => option.html)

        const hash = this.props.location.hash
        let selected: 'showNotes' | 'summary' | 'transcript' = (hash === '#showNotes' && 'showNotes') || (hash === '#transcript' && 'transcript') || 'summary'

        return (
            <Layout location={this.props.location} meta={meta}>
                <Helmet>
                    <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
                    />
                </Helmet>
                <ContentPage
                    title="The Podcast🎙"
                    titleClassName="podcast__banner"
                    mainActions={
                        <div className="d-flex flex-column align-items-center podcast__subbanner">
                            Conversations, stories, and insights from dev tool creators
                        </div>
                }>
                    <ContentSection color="black">
                        <div className="podcast">
                            <div className="podcast__episode">
                                <div className="podcast__title">{title}</div>
                                <div className="podcast__subscribe-episode">
                                    {subscriptionLinks}
                                </div>
                                <div className="podcast__backtoall">
                                    <a href="/podcast">&lsaquo; All episodes</a>
                                </div>
                                {guestsHTML && (<div dangerouslySetInnerHTML={{ __html: guestsHTML }} className="podcast__people" />)}
                                <div className="podcast__date">{publishDate}</div>
                                { audioHTML && (<div dangerouslySetInnerHTML={{ __html: audioHTML }} className="podcast__player" />)}
                                <div className="podcast__content-option">
                                    {options.map(({ hash, name }) => (
                                        <a key={name} dangerouslySetInnerHTML={{ __html: name }} className={selected === hash ? "podcast__content-option-selected" : ""} href={`#${hash}`} />
                                    ))}
                                </div>
                                {options.filter(op => op.hash === selected).map(({ name, html }) => (
                                    <div key={name} className="podcast__description" dangerouslySetInnerHTML={{ __html: html || '' }} />
                                ))}
                            </div>

                            <section className="blog-post__footer mt-4 pt-4">
                                <div className="pt-4">
                                    <SocialLinks url={`https://about.sourcegraph.com/podcast/${slug}`} title={title} />
                                </div>
                            </section>
                        </div>
                    </ContentSection>
                </ContentPage>
                <Jumbotron
                    color="dark"
                    className="py-4"
                    logomark={false}
                    title="Try Sourcegraph now"
                    description="Explore, navigate, and better understand all code, everywhere, faster, with Universal Code Search"
                >
                    <GetSourcegraphNowActions />
                </Jumbotron>
            </Layout>
        )
    }
}

export const pageQuery = graphql`
    query podcastEpisodeTemplate($fileSlug: String) {
        markdownRemark(fields: { slug: { eq: $fileSlug } }) {
            frontmatter {
                title
                tags
                publishDate(formatString: "MMMM D, YYYY")
                slug
            }
            html
            excerpt
            fields {
                slug
            }
        }
    }
`
