import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Popover,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import { Form, Link } from '@remix-run/react'
import React from 'react'
import { useUser } from '~/utils'
import { LockOpen } from '@mui/icons-material'

const AccountMenu: React.FC = () => {
  const user = useUser()

  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)

  return (
    <>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar src={user.avatar} />
          </ListItemAvatar>
          <ListItemText primary={user.tag} />
        </ListItem>
        <Form action="/logout" method="post">
          <ListItem button component="button" type="submit">
            <ListItemIcon>
              <LockOpen />
            </ListItemIcon>
            <ListItemText primary="로그아웃" />
          </ListItem>
        </Form>
      </Popover>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <Avatar src={user.avatar} />
      </IconButton>
    </>
  )
}

export const AppHeader: React.FC = () => {
  return (
    <AppBar>
      <Toolbar>
        <Link to="/app" style={{ textDecoration: 'none' }}>
          <Typography variant="h6" color="white" fontWeight={600}>
            YPBOT
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <AccountMenu />
      </Toolbar>
    </AppBar>
  )
}
