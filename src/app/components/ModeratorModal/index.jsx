import './styles.less';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { endpoints, models } from '@r/api-client';
import { Modal } from '@r/widgets/modal';
import { ModalBanner } from 'app/components/ModalBanner';
import { DropdownRow } from 'app/components/Dropdown';
import modelFromThingId from 'app/reducers/helpers/modelFromThingId';
import { getStatusBy, getApprovalStatus } from 'lib/modToolHelpers.js';
import * as modActions from 'app/actions/modTools';

import { ReportsModal } from 'app/components/ReportsModal';

const { Modtools } = endpoints;
const DISTINGUISH_TYPES = Modtools.DISTINGUISH_TYPES;
const { ModelTypes } = models;
const T = React.PropTypes;

export class ModeratorModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showReportsModal: false,
    };
  }

  onDistinguish(distinguishType) {
    const type = (distinguishType === DISTINGUISH_TYPES.NONE
                          ? DISTINGUISH_TYPES.MODERATOR
                          : DISTINGUISH_TYPES.NONE);
    this.props.onDistinguish(type);
  }

  showDistinguish(distinguishType) {
    return !(distinguishType === DISTINGUISH_TYPES.NONE);
  }

  toggleReportsModal(e, onClick=null) {
    if (!onClick) {
      // don't close the modal -- show report modal instead
      e.stopPropagation();
    } else {
      onClick();
    }

    this.setState({ showReportsModal: !this.state.showReportsModal });
  }

  render() {
    let canSticky = false;
    if (this.props.targetType === ModelTypes.POST) {
      canSticky = true;
    } else if (this.props.targetType === ModelTypes.COMMENT) {
      const { isMine, target } = this.props;
      canSticky = isMine && target.parentId === target.linkId;
    }

    if (this.state.showReportsModal) {
      return (
        <div className='ModeratorModalWrapper' onClick={ (e) => this.toggleReportsModal(e, this.props.onClick) }>
          <Modal
            id={ this.props.modModalId }
            className='DropdownModal ModeratorModal'
          >
            <div onClick={ (e) => this.toggleReportsModal(e, this.props.onClick) }>
              <div className='ModeratorModalRowWrapper'>
                <ReportsModal
                  userReports={ this.props.userReports }
                  modReports={ this.props.modReports }
                  isApproved={ this.props.isApproved }
                  isRemoved={ this.props.isRemoved }
                  isSpam={ this.props.isSpam }
                  approvedBy={ this.props.approvedBy }
                  removedBy={ this.props.removedBy }
                />
              </div>
            </div>
          </Modal>
        </div>
      );
    }

    return (
      <div className='ModeratorModalWrapper'>
        <Modal
          id={ this.props.modModalId }
          className='DropdownModal ModeratorModal'
        >
          <div className='DropdownClose'>
            <DropdownRow
              icon='x'
              onClick={ this.props.onClick }
            />
          </div>
          <div onClick={ this.props.onClick }>
            <ModalBanner
              status={ getApprovalStatus(this.props.isApproved,
                                         this.props.isRemoved,
                                         this.props.isSpam,) }
              statusBy={ getStatusBy(this.props.isApproved,
                                     this.props.isRemoved,
                                     this.props.isSpam,
                                     this.props.removedBy,
                                     this.props.approvedBy,) }
              pageName={ 'moderatorModal' }
            />
            <div className='ModeratorModalRowWrapper'>
              { this.props.targetType === ModelTypes.POST
                ? [
                  <DropdownRow
                    icon='nsfw'
                    text={ this.props.isNSFW ? 'Unmark NSFW' : 'Mark NSFW' }
                    onClick={ this.props.toggleNSFW }
                    isSelected={ this.props.isNSFW }
                  />,
                  <DropdownRow
                    icon='spoiler'
                    text={ this.props.isSpoiler ? 'Unspoiler' : 'Spoiler' }
                    onClick={ this.props.toggleSpoiler }
                    isSelected={ this.props.isSpoiler }
                  />,
                  <DropdownRow
                    icon='lock'
                    text={ this.props.isLocked ? 'Unlock' : 'Lock' }
                    onClick={ this.props.toggleLock }
                    isSelected={ this.props.isLocked }
                  />,
                ]
                : null
              }
              { 
                (this.props.userReports.length > 0 || this.props.modReports.length > 0) &&
                <DropdownRow
                  icon='flag'
                  text='Reports'
                  onClick={ (e) => this.toggleReportsModal(e) }
                  isSelected={ true }
                />
              }
              { this.props.isMine
                ? <DropdownRow
                    icon='distinguish'
                    text={ this.showDistinguish(this.props.distinguishType) ? 'Undistinguish' : 'Distinguish' }
                    onClick={ () => this.onDistinguish(this.props.distinguishType) }
                    isSelected={ this.showDistinguish(this.props.distinguishType) }
                  />
                : null
              }
              { canSticky
                ? <DropdownRow
                    icon='sticky'
                    text={ `${this.props.isSticky ? 'Unpin' : 'Pin'} as announcement` }
                    onClick={ this.props.onToggleSticky }
                    isSelected={ this.props.isSticky }
                  />
                : null
              }
              <div className='m-nonToggleActions'>
                <DropdownRow
                  icon='delete_remove'
                  text='Remove'
                  onClick={ this.props.onRemove }
                  isSelected={ this.props.isRemoved }
                />
                <DropdownRow
                  icon='spam'
                  text='Spam'
                  onClick={ this.props.onSpam }
                  isSelected={ this.props.isSpam }
                />
                <DropdownRow
                  icon='check-circled'
                  text='Approve'
                  onClick={ this.props.onApprove }
                  isSelected={ this.props.isApproved }
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ModeratorModal.propTypes = {
  id: T.string.isRequired,
  modModalId: T.string.isRequired,
  onClick: T.func,
  onSpam: T.func.isRequired,
  onApprove: T.func.isRequired,
  onRemove: T.func.isRequired,
  toggleLock: T.func.isRequired,
  toggleNSFW: T.func.isRequired,
  toggleSpoiler: T.func.isRequired,
  isSticky: T.bool.isRequired,
  isApproved: T.bool.isRequired,
  isRemoved: T.bool.isRequired,
  isSpam: T.bool.isRequired,
  removedBy: T.string,
  approvedBy: T.string,
  distinguishType: T.string,
  modReports: T.arrayOf(T.arrayOf(T.string)),
  isMine: T.bool,
  target: T.object,
  targetType: T.oneOf([ModelTypes.COMMENT, ModelTypes.POST]).isRequired,
  userReports: T.arrayOf(T.arrayOf(T.string)),
};

ModeratorModal.defaultProps = {
  target: null,
  modReports: [],
  userReports: [],
};

const selector = createSelector(
  (state, props) => modelFromThingId(props.id, state),
  target => ({ target })
);

const mapDispatchToProps = (dispatch, { id, isSticky, targetType }) => ({
  onSpam: () => dispatch(modActions.remove(id, true)),
  onApprove: () => dispatch(modActions.approve(id)),
  onRemove: () => dispatch(modActions.remove(id, false)),
  toggleLock: () => dispatch(modActions.toggleLock(id)),
  toggleNSFW: () => dispatch(modActions.toggleNSFW(id)),
  toggleSpoiler: () => dispatch(modActions.toggleSpoiler(id)),
  onDistinguish: (distinguishType) => dispatch(modActions.distinguish(id, distinguishType)),
  onToggleSticky: () => {
    if (targetType === ModelTypes.POST) {
      dispatch(modActions.setStickyPost(id, !isSticky));
    } else {
      dispatch(modActions.setStickyComment(id, !isSticky));
    }
  },
});

export default connect(selector, mapDispatchToProps)(ModeratorModal);
