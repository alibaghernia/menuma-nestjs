export const makeImageUrl = (image_uuid: string) => {
  let host = process.env.SERVER_HOST;
  if (host == '0.0.0.0') host = '127.0.0.1';
  const port = process.env.SERVER_PORT;
  const domain = process.env.WEB_DOMAIN || `http://${[host, port].join(':')}`;

  return `${domain}/files/${image_uuid}`;
};
