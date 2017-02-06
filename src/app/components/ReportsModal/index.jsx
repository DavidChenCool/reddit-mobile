import React from 'react';
import { ApprovalStatusBanner } from 'app/components/ApprovalStatusBanner';
import { getStatusBy, getApprovalStatus } from 'lib/modToolHelpers.js';
import { DropdownModal, DropdownRow } from 'app/components/Dropdown';
const T = React.PropTypes;

export function ReportsModal(props) {
  const {
    id,
    onToggleModal,
    userReports,
    modReports,
    isApproved,
    isRemoved,
    isSpam,
    removedBy,
    approvedBy,
  } = props;

  return (
    <DropdownModal id={ id } onClick={ onToggleModal }>
      <ApprovalStatusBanner
        status={ getApprovalStatus(isApproved,
                                   isRemoved,
                                   isSpam,) }
        statusBy={ getStatusBy(isApproved,
                               isRemoved,
                               isSpam,
                               removedBy,
                               approvedBy,) }
        pageName={ 'moderatorModal' }
      />
      <DropdownRow text='Moderator Reports'/>
      { 
        modReports.map(function(report) {
          return (
            <DropdownRow text={ `${report.username}: ${report.reason}` } />
          );
        })
      }
      <DropdownRow text='User Reports'/>
      { 
        userReports.map(function(report) {
          return (
            <DropdownRow text={ `${report.count}: ${report.reason}` } />
          );
        })
      }
    </DropdownModal>
  );
}

ReportsModal.propTypes = {
  id: T.string.isRequired,
  onToggleModal: T.func.isRequired,
  userReports: T.arrayOf(T.object),
  modReports: T.arrayOf(T.object),
  isApproved: T.bool,
  isRemoved: T.bool,
  isSpam: T.bool,
  removedBy: T.string,
  approvedBy: T.string,
};

ReportsModal.defaultProps = {
  userReports: [],
  modReports: [],
  isApproved: true,
  isRemoved: false,
  isSpam: false,
  removedBy: null,
  approvedBy: null,
};
