/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import { useAuth } from '../auth/AuthProvider';
import { useMeContext } from '../auth/MeContext';
import { Button } from '../ui/components';
import { charcoal, lead, paper, rem, silver, steel } from '../ui/theme';

const headerStyles = css({
  backgroundColor: paper.rgb,
  borderBottom: `1px solid ${steel.rgb}`,
});

const innerStyles = css({
  width: '100%',
  maxWidth: rem(1120),
  margin: '0 auto',
  padding: `${rem(12)} ${rem(24)}`,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(16),
});

const brandStyles = css({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: rem(8),
  textDecoration: 'none',
  color: charcoal.rgb,
  fontWeight: 'bold',
  fontSize: rem(18),
});

const brandMarkStyles = css({
  fontSize: rem(11),
  letterSpacing: rem(1.5),
  textTransform: 'uppercase',
  color: lead.rgb,
  fontWeight: 'bold',
});

const menuWrapperStyles = css({ position: 'relative' });

const menuStyles = css({
  position: 'absolute',
  right: 0,
  top: `calc(100% + ${rem(8)})`,
  zIndex: 10,
  minWidth: rem(240),
  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(8),
  boxShadow: `0px 4px 12px ${steel.rgb}`,
  padding: rem(16),
  display: 'grid',
  gap: rem(12),
  justifyItems: 'start',
});

const identityStyles = css({
  display: 'grid',
  gap: rem(2),
  paddingBottom: rem(12),
  borderBottom: `1px solid ${silver.rgb}`,
  width: '100%',
});

const nameStyles = css({ fontWeight: 'bold', color: charcoal.rgb });
const emailStyles = css({ fontSize: rem(14), color: lead.rgb });

const menuLinkStyles = css({
  color: charcoal.rgb,
  fontSize: rem(14),
  textDecoration: 'none',
  ':hover': { textDecoration: 'underline' },
});

const Header: FC = () => {
  const me = useMeContext();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <header css={headerStyles}>
      <div css={innerStyles}>
        <Link to="/" css={brandStyles}>
          <span css={brandMarkStyles}>ASAP</span>
          <span>Demos</span>
        </Link>
        <div css={menuWrapperStyles} ref={wrapperRef}>
          <Button
            small
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            {me.name}
          </Button>
          {open && (
            <div css={menuStyles} role="menu">
              <div css={identityStyles}>
                <span css={nameStyles}>{me.name}</span>
                <span css={emailStyles}>{me.email}</span>
              </div>
              {me.role === 'creator' && (
                <>
                  <Link
                    to="/studio/upload"
                    css={menuLinkStyles}
                    onClick={() => setOpen(false)}
                  >
                    Upload a demo
                  </Link>
                  <Link
                    to="/invites"
                    css={menuLinkStyles}
                    onClick={() => setOpen(false)}
                  >
                    Invites
                  </Link>
                </>
              )}
              <Button small onClick={logout}>
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
