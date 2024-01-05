import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import * as timeago from 'timeago.js';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, OverlayTrigger, Tooltip } from '@edx/paragon';
import { Institution, School } from '@edx/paragon/icons';

import { Routes } from '../../data/constants';
import { useShowLearnersTab } from '../data/hooks';
import messages from '../messages';
import { DiscussionContext } from './context';
import timeLocale from './time-locale';

const AuthorLabel = ({
  author,
  authorName,
  authorLabel,
  linkToProfile,
  labelColor,
  alert,
  postCreatedAt,
  authorToolTip,
  postOrComment,
}) => {
  timeago.register('time-locale', timeLocale);
  const intl = useIntl();
  const { courseId } = useContext(DiscussionContext);
  let icon = null;
  let authorLabelMessage = null;

  const isInSidebarContext = window.location.search === '?inContextSidebar';

  if (authorLabel === 'Staff') {
    icon = Institution;
    authorLabelMessage = intl.formatMessage(messages.authorLabelStaff);
  }

  if (authorLabel === 'Community TA') {
    icon = School;
    authorLabelMessage = intl.formatMessage(messages.authorLabelTA);
  }

  const isRetiredUser = author ? author.startsWith('retired__user') : false;
  const showTextPrimary = !authorLabelMessage && !isRetiredUser && !alert;
  const className = classNames('d-flex flex-wrap align-items-center', { 'mb-0.5': !postOrComment }, labelColor);

  const showUserNameAsLink = useShowLearnersTab()
    && linkToProfile && author && author !== intl.formatMessage(messages.anonymous) && !isInSidebarContext;

  const authorFullName = useMemo(() => (
    <span
      className={classNames('mr-1.5 font-size-14 font-style font-weight-500', {
        'text-gray-700': isRetiredUser,
        'text-primary-500': !authorLabelMessage && !isRetiredUser,
      })}
      role="heading"
      aria-level="2"
    >
      {isRetiredUser ? '[Deactivated]' : authorName ? `${authorName} (${author})` : author}
    </span>
  ), [author, authorLabelMessage, isRetiredUser]);

  const labelContents = useMemo(() => (
    <>
      <OverlayTrigger
        overlay={(
          <Tooltip id={`endorsed-by-${author}-tooltip`}>
            {author}
          </Tooltip>
        )}
        trigger={['hover', 'focus']}
      >
        <div className={classNames('d-flex flex-row align-items-center', {
          'disable-div': !authorToolTip,
        })}
        >
          <Icon
            style={{
              width: '1rem',
              height: '1rem',
            }}
            src={icon}
            data-testid="author-icon"
          />
          {authorLabelMessage && (
            <span
              className={classNames('mr-1.5 font-size-14 font-style font-weight-500', {
                'text-primary-500': showTextPrimary,
                'text-gray-700': isRetiredUser,
              })}
              style={{ marginLeft: '2px', whiteSpace: 'nowrap' }}
            >
              {authorLabelMessage}
            </span>
          )}
        </div>
      </OverlayTrigger>
      {postCreatedAt && (
        <span
          title={postCreatedAt}
          className={classNames('align-content-center', {
            'text-white': alert,
            'text-gray-500': !alert,
          })}
          style={{
            lineHeight: '22px', fontSize: '12px', height: '22px', marginTop: '2px',
          }}
        >
          {timeago.format(postCreatedAt, 'time-locale')}
        </span>
      )}
    </>
  ), [author, authorLabelMessage, authorToolTip, icon, isRetiredUser, postCreatedAt, showTextPrimary, alert]);

  return showUserNameAsLink
    ? (
      <div className={className}>
        <Link
          data-testid="learner-posts-link"
          id="learner-posts-link"
          to={generatePath(Routes.LEARNERS.POSTS, { learnerUsername: author, courseId })}
          className="text-decoration-none"
          style={{ width: 'fit-content' }}
        >
          {!alert && authorFullName}
        </Link>
        {labelContents}
      </div>
    )
    : <div className={className}>{authorFullName}{labelContents}</div>;
};

AuthorLabel.propTypes = {
  author: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorLabel: PropTypes.string,
  linkToProfile: PropTypes.bool,
  labelColor: PropTypes.string,
  alert: PropTypes.bool,
  postCreatedAt: PropTypes.string,
  authorToolTip: PropTypes.bool,
  postOrComment: PropTypes.bool,
};

AuthorLabel.defaultProps = {
  linkToProfile: false,
  authorLabel: null,
  labelColor: '',
  alert: false,
  postCreatedAt: null,
  authorToolTip: false,
  postOrComment: false,
};

export default React.memo(AuthorLabel);
