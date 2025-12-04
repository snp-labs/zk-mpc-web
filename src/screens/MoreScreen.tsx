import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MoreScreen.module.css';

import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // 프로필 아이콘
import EditIcon from '@mui/icons-material/Edit'; // 편집 아이콘
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // 오른쪽 화살표
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'; // 내 지갑 아이콘 (폴더/지갑)
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined'; // 키 복구 아이콘
import LanguageIcon from '@mui/icons-material/Language'; // 언어 아이콘
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'; // 공지사항/이용약관 아이콘
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // 버전정보 아이콘
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined'; // 거래내역 탭 아이콘 (임시)
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; // 더보기 탭 아이콘
import AddCircleIcon from '@mui/icons-material/AddCircle'; // 토큰 버튼 아이콘 (파란 원)
import { useMPCStore } from '../hooks/useMPCStore';
const MoreScreen = () => {
  const navigate = useNavigate();
  const { userId, auxInfo, tshare, presign, setAuxInfo, setTShare, setPresign, setAddress, setPk } = useMPCStore();

  
  const handleNavigateToKeyRecovery = () => {
    navigate('/more/key-recovery-request');
  };
  
  // 모든 아이콘은 <IconName sx={{ fontSize: '20px' }} /> 형태로 사용됩니다.

  return (
    <div className={styles.container}>
      <div className={styles.contentArea}>
        <h2 className={styles.header}>더보기</h2>

        <div className={styles.profileBox}>
          <AccountCircleIcon className={styles.profileIcon} sx={{ fontSize: 32 }} /> 
          <span className={styles.profileText}>안녕하세요! {userId}님</span>
          <EditIcon className={styles.editIcon} sx={{ fontSize: 18 }} />
        </div>
        
        <h3 className={styles.sectionHeader}>지갑관리</h3>
        <ul className={styles.menuList}>
          
          <li className={styles.menuItem}>
            <div className={styles.itemContent}>
              <AccountBalanceWalletOutlinedIcon className={styles.itemIcon} />
              <span>내 지갑</span>
            </div>
            <ArrowForwardIosIcon className={styles.arrowIcon} />
          </li>
          
          <li className={styles.menuItem} onClick={handleNavigateToKeyRecovery}>
            <div className={styles.itemContent}>
              <KeyOutlinedIcon className={styles.itemIcon} />
              <span>지갑 키 복구 관리</span>
            </div>
            <ArrowForwardIosIcon className={styles.arrowIcon} />
          </li>
        </ul>
        
        <h3 className={styles.sectionHeader}>General</h3>
        <ul className={styles.menuList}>
          
          <li className={styles.menuItem}>
            <div className={styles.itemContent}>
              <LanguageIcon className={styles.itemIcon} />
              <span>언어</span>
            </div>
            <ArrowForwardIosIcon className={styles.arrowIcon} />
          </li>

          <li className={styles.menuItem}>
            <div className={styles.itemContent}>
              <DescriptionOutlinedIcon className={styles.itemIcon} />
              <span>공지사항</span>
            </div>
            <ArrowForwardIosIcon className={styles.arrowIcon} />
          </li>

          <li className={styles.menuItem}>
            <div className={styles.itemContent}>
              <DescriptionOutlinedIcon className={styles.itemIcon} />
              <span>이용약관</span> 
            </div>
            <ArrowForwardIosIcon className={styles.arrowIcon} />
          </li>

          <li className={styles.menuItem}>
            <div className={styles.itemContent}>
              <InfoOutlinedIcon className={styles.itemIcon} />
              <span>버전정보</span>
            </div>
            <span className={styles.versionText}>1.1.1</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MoreScreen;