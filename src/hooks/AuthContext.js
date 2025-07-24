import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function getParentPwd() {
  return localStorage.getItem('kidchat_parent_pwd') || '';
}
function setParentPwd(pwd) {
  localStorage.setItem('kidchat_parent_pwd', pwd);
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('kidchat_auth') || 'kid');
  const [showPwdPrompt, setShowPwdPrompt] = useState(false);

  // 切换角色，家长模式需密码
  const switchRole = (newRole) => {
    if (newRole === 'parent') {
      setShowPwdPrompt(true);
    } else {
      setRole('kid');
      localStorage.setItem('kidchat_auth', 'kid');
    }
  };

  // 密码校验
  const verifyParentPwd = (inputPwd) => {
    const pwd = getParentPwd();
    if (!pwd) {
      // 首次设置密码
      setParentPwd(inputPwd);
      setRole('parent');
      localStorage.setItem('kidchat_auth', 'parent');
      setShowPwdPrompt(false);
      return true;
    }
    if (inputPwd === pwd) {
      setRole('parent');
      localStorage.setItem('kidchat_auth', 'parent');
      setShowPwdPrompt(false);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ role, switchRole, showPwdPrompt, setShowPwdPrompt, verifyParentPwd, setParentPwd }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 