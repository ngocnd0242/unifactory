import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IoIosReturnLeft } from 'react-icons/io'
import i18n, { availableLanguages, LANG_NAME } from '../../i18n'
import { ReactComponent as MenuIcon } from 'assets/images/menu.svg'
import { useDarkModeManager } from 'state/user/hooks'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { ApplicationModal } from 'state/application/actions'
import { setAppManagement } from 'state/application/actions'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
// import { ExternalLink } from 'theme';
import { useProjectInfo } from 'state/application/hooks'
import { useActiveWeb3React } from 'hooks'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

export const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg1};
  transition: 0.2s;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.bg1};
  transition: 0.2s;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;
  padding: 0.6rem 0.9rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;
  transition: 0.2s;
`

// const MenuItem = styled(ExternalLink)`
//   cursor: pointer;
//   flex: 1;
//   padding: 0 0 0.2rem;
//   color: ${({ theme }) => theme.text2};
//   word-break: keep-all;
//   white-space: nowrap;
//   font-size: 0.9em;
//   transition: 0.2s;
//   text-decoration: none;

//   :hover,
//   :focus {
//     color: ${({ theme }) => theme.text1};
//     cursor: pointer;
//     text-decoration: none;
//   }
// `;

const MenuButton = styled.span`
  cursor: pointer;
  flex: 1;
  padding: 0 0 0.6rem;
  color: ${({ theme }) => theme.text2};
  word-break: keep-all;
  white-space: nowrap;
  font-size: 0.9em;
  transition: 0.2s;

  :hover,
  :focus {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const Title = styled.h4`
  margin: 0.3rem 0 0.8rem;
`

export const ClickableMenuItem = styled.a<{ active: boolean }>`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  transition: 0.2s;

  :hover,
  :focus {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }

  > svg {
    margin-right: 8px;
  }
`

const ReturnButton = styled.button`
  padding: 0;
  padding-left: 0.4rem;
  border: none;
  text-align: left;
  font-size: 1.4rem;
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  :hover,
  :focus {
    cursor: pointer;
  }
`

function LanguageMenu({ close }: { close: () => void }) {
  const toggle = useToggleModal(ApplicationModal.LANGUAGE)

  return (
    <MenuFlyout>
      <ReturnButton onClick={close}>
        <IoIosReturnLeft size="" />
      </ReturnButton>

      {availableLanguages.map((lang) => (
        <ClickableMenuItem
          active={i18n.language === lang}
          key={lang}
          onClick={() => {
            i18n.changeLanguage(lang)
            toggle()
          }}
        >
          {LANG_NAME[lang] || lang.toUpperCase()}
        </ClickableMenuItem>
      ))}
    </MenuFlyout>
  )
}

export default function Menu() {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { admin } = useProjectInfo()
  const dispatch = useDispatch()

  const [isAdmin, setIsAdmin] = useState<boolean>(account?.toLowerCase() === admin?.toLowerCase())

  useEffect(() => {
    setIsAdmin(account?.toLowerCase() === admin?.toLowerCase())
  }, [account, admin])

  const openSettings = () => {
    dispatch(setAppManagement({ status: true }))
  }

  const node = useRef<HTMLDivElement>()
  const [menu, setMenu] = useState<'main' | 'lang'>('main')
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  useEffect(() => setMenu('main'), [open])
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <>
          {menu === 'lang' ? (
            <LanguageMenu close={() => setMenu('main')} />
          ) : (
            <MenuFlyout>
              <Title>{t('settings')}</Title>
              <MenuButton onClick={toggleDarkMode}>{darkMode ? t('lightTheme') : t('darkTheme')}</MenuButton>
              <MenuButton onClick={() => setMenu('lang')}>{t('language')}</MenuButton>
              {isAdmin && <MenuButton onClick={openSettings}>{t('manage')}</MenuButton>}
            </MenuFlyout>
          )}
        </>
      )}
    </StyledMenu>
  )
}