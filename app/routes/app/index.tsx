import { ChevronRight, Dns } from '@mui/icons-material'
import {
  CardActionArea,
  Paper,
  Stack,
  Typography,
  Box,
  Grid,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material'
import { Link } from '@remix-run/react'
import { useGuildList } from '~/util/guilds'

export default function App() {
  const guilds = useGuildList()

  return (
    <div>
      <Paper
        sx={{ overflow: 'hidden', display: 'block', textDecoration: 'none' }}
        variant="outlined"
        component={Link}
        to="rules"
      >
        <CardActionArea sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center">
            <Typography variant="h5" fontWeight={600}>
              규칙 관리
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <ChevronRight />
          </Stack>
        </CardActionArea>
      </Paper>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {guilds.map((x, i) => (
          <Grid item key={i} xs={12} md={6} lg={4}>
            <Paper variant="outlined">
              <ListItem button component={Link} to={`guilds/${x.id}`}>
                <ListItemAvatar>
                  <Avatar src={x.icon || undefined}>
                    <Dns />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={x.name} />
              </ListItem>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
