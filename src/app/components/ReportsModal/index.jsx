import './styles.less';
import React from 'react';
import { ApprovalStatusBanner } from 'app/components/ApprovalStatusBanner';
import { getStatusBy, getApprovalStatus } from 'lib/modToolHelpers.js';
import { DropdownModal, DropdownRow } from 'app/components/Dropdown';
const T = React.PropTypes;

export function ReportsModal(props) {
  const {
    id,
    userReports,
    modReports,
    isApproved,
    isRemoved,
    isSpam,
    removedBy,
    approvedBy,
  } = props;

  return (
    <div>
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
      { showReports(modReports, 'Moderator') }
      { showReports(userReports, 'User')}
    </div>
  );
}

function showReports(reports, reportType) {
  if (reports.length > 0) {
    return (
      <div className='Reports'>
        <div className='m-reports-title'>{ `${reportType} Reports:` }</div>
        {
          reports.map(function(report) {
            return (
              <div>{ `${report[1]}: ${report[0]}` }</div>
            );
          })
        }
      </div>
    );
  }
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
