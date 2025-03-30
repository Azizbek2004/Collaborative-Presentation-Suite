const Presentation = require('../models/Presentation');
const Slide = require('../models/Slide');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', async ({ presentationId, nickname }) => {
      socket.join(presentationId);
      const presentation = await Presentation.findById(presentationId);
      if (!presentation) return socket.emit('error', 'Presentation not found');

      const existingUser = presentation.users.find(
        (u) => u.nickname === nickname
      );
      if (!existingUser) {
        const role = nickname === presentation.creator ? 'creator' : 'viewer';
        presentation.users.push({ nickname, role });
        await presentation.save();
      }

      const userRole = presentation.users.find(
        (u) => u.nickname === nickname
      ).role;
      socket.emit('init', {
        presentation: await Presentation.findById(presentationId).populate(
          'slides'
        ),
        role: userRole,
      });

      io.to(presentationId).emit('updateUsers', presentation.users);
    });

    socket.on('addSlide', async ({ presentationId }) => {
      const presentation = await Presentation.findById(presentationId);
      if (!presentation) return socket.emit('error', 'Presentation not found');

      const user = presentation.users.find(
        (u) => u.nickname === socket.nickname
      );
      if (!user || user.role !== 'creator')
        return socket.emit('error', 'Only creator can add slides');

      const slide = new Slide({
        presentation: presentationId,
        textBlocks: [{ content: 'New Slide', x: 0, y: 0 }],
      });
      await slide.save();
      presentation.slides.push(slide._id);
      await presentation.save();

      io.to(presentationId).emit('slideAdded', slide);
    });

    socket.on(
      'editTextBlock',
      async ({ presentationId, slideId, textBlockId, content }) => {
        const presentation = await Presentation.findById(presentationId);
        const user = presentation.users.find(
          (u) => u.nickname === socket.nickname
        );
        if (!user || user.role === 'viewer')
          return socket.emit('error', 'Permission denied');

        const slide = await Slide.findById(slideId);
        if (!slide) return socket.emit('error', 'Slide not found');

        const textBlock = slide.textBlocks.id(textBlockId);
        if (!textBlock) return socket.emit('error', 'Text block not found');

        textBlock.content = content;
        await slide.save();

        io.to(presentationId).emit('textBlockUpdated', {
          slideId,
          textBlockId,
          content,
        });
      }
    );

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
