    import React from 'react';
    import styles from './TokenCard.module.css'; // TokensScreen의 CSS를 공유하거나 해당 컴포넌트의 CSS를 가져옵니다.

    const TokenCard = ({ token, balance, navigate, allowImage }) => {
    
    const { icon, name, symbol } = token;
    const primaryColor = '#0055FF';

    const handleSendClick = () => {
        navigate('/send', { state: { token } });
    };

    return (
        <div className={styles.card}>
        <div className={styles.cardTopRow}>
            <img src={icon} alt={`${name} icon`} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{name}</p>
        </div>
        <div className={styles.cardBottomRow}>
            <p className={styles.balanceText}>
            {"잔액     "}
            <span className={styles.balanceAmount}>{balance}</span>
            {` ${symbol}`}
            </p>
            {allowImage && (
                    <div
                        className={styles.sendButtonContainer}
                        onClick={handleSendClick}
                    >
                        {/* allowImage는 여기서는 이미지 경로가 됩니다. */}
                        <div className={styles.iconButtonWrapper} style={{ backgroundColor: primaryColor }}>
                            <img src={allowImage} alt="Send" style={{ width: 12, height: 12 }} />
                        </div>
                        <p className={styles.sendButtonText} style={{ color: primaryColor }}>보내기</p>
                    </div>
                )}
        </div>
        </div>
    );
    };

    export default TokenCard;